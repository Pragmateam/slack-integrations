import { deferredExecute } from "@/utils/helpers";
import { toFormattedString } from "@/utils/json";
import type { Middleware, SlackCommandMiddlewareArgs } from "@slack/bolt";
import { WebClient } from "@slack/web-api";
import { Member } from "@slack/web-api/dist/response/UsersListResponse";

const PRAGMATEAM_EMAIL_DOMAIN = "@pragma.team";

const isPragmaUser = (m: Member) =>
  m.profile?.email?.includes(PRAGMATEAM_EMAIL_DOMAIN);

const isActiveUser = (m: Member) =>
  !m.deleted && !m.is_app_user && !m.is_bot && !m.is_workflow_bot;

const userPresenceMapper = (client: WebClient) => async (member: Member) => {
  const userPresence = await client.users.getPresence({ user: member.id! });

  return `<@${member.id}> (${
    userPresence.ok ? userPresence.presence : "unknown"
  })`;
};

const handleCommand = async (args: CommandHandlerArgs) => {
  const { body, command, payload, respond, logger, client } = args;

  try {
    // Log command request on CloudWatch
    logger.debug("BODY", toFormattedString(body));
    logger.debug("COMMAND", toFormattedString(command));
    logger.debug("PAYLOAD", toFormattedString(payload));
    logger.debug("PAYLOAD::TEXT", payload.text);

    // Get all users
    const { ok, members } = await client.users.list();
    if (!ok) throw new Error("Failed to retrieve user list");

    const activePragmaUsers = members!.filter(
      (item: Member) => isPragmaUser(item) && isActiveUser(item)
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
  return async (args: CommandHandlerArgs) => {
    const { ack } = args;

    // Offload expensive tasks to a different turn in the EventLoop
    deferredExecute(handleCommand, undefined, args);

    // Acknowledge command request immediately within 3s
    await ack();
  };
};
