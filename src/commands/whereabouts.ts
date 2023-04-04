import type { AllMiddlewareArgs, Middleware, SlackCommandMiddlewareArgs } from "@slack/bolt";
import { StringIndexed } from "@slack/bolt/dist/types/helpers";
import { WebClient } from "@slack/web-api";
import { Member } from "@slack/web-api/dist/response/UsersListResponse";
import { deferredExecute } from "@/utils/helpers";

type CommandArgs = Omit<SlackCommandMiddlewareArgs & AllMiddlewareArgs<StringIndexed>, "ack">;

const PRAGMATEAM_EMAIL_DOMAIN = "@pragma.team";

const isPragmaUser = (m: Member) =>
  m.profile?.email?.includes(PRAGMATEAM_EMAIL_DOMAIN);

const isActiveUser = (m: Member) =>
  !m.deleted && !m.is_app_user && !m.is_bot && !m.is_workflow_bot;

const userPresenceMapper = (client: WebClient) => async (member: Member) => {
  const userPresence = await client.users.getPresence({ user: member.id! });

  return `<@${member.id}> (${userPresence.ok ? userPresence.presence : "unknown"})`;
};

const handleCommand = async ({ body, command, payload, respond, logger, client }: CommandArgs) => {
  try {
    // Log command request on CloudWatch
    logger.debug("BODY", JSON.stringify(body, null, 2));
    logger.debug("COMMAND", JSON.stringify(command, null, 2));
    logger.debug("PAYLOAD", JSON.stringify(payload, null, 2));
    logger.debug("PAYLOAD::TEXT", payload.text);

    // Get all users
    const { ok, members } = await client.users.list();
    if (!ok) throw new Error("Failed to retrieve user list");

    const activePragmaUsers = members!.filter((item) =>
      isPragmaUser(item) && isActiveUser(item)
    );

    // Get all members presence (a.k.a. status -> active, away, etc.)
    const membersWithPresence = await Promise.all(
      activePragmaUsers.map(userPresenceMapper(client))
    );

    // Respond to the command request
    await respond({
      response_type: "ephemeral",
      text: membersWithPresence.join("\n"),
      replace_original: true,
      delete_original: true,
    });
  } catch (err) {
    logger.error(err);
    await respond({
      response_type: "ephemeral",
      text: "Something went wrong! Please try again later.",
      replace_original: true,
      delete_original: true,
      as_user: true,
    });
  }
};

export default (): Middleware<SlackCommandMiddlewareArgs> => {
  return async ({ ack, ...args }) => {
    // Offload expensive tasks to a different turn in the EventLoop
    deferredExecute(handleCommand, undefined, { ...args });

    // Acknowledge command request immediately within 3s
    await ack();
  };
};
