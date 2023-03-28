import * as array from "@/utils/array";
import * as json from "@/utils/json";
import type { Middleware, SlackCommandMiddlewareArgs } from "@slack/bolt";
import { WebClient } from "@slack/web-api";
import { Member } from "@slack/web-api/dist/response/UsersListResponse";

const PRAGMATEAM_EMAIL_DOMAIN = "@pragma.team";
// const PRAGMATEAM_TEAM_ID = "unknown";

const predicates = {
  // TODO: shall we filter by team id?
  pragmaUsers: (m: Member) =>
    m.profile?.email?.includes(PRAGMATEAM_EMAIL_DOMAIN),

  realActiveUsers: (m: Member) =>
    !m.deleted && !m.is_app_user && !m.is_bot && !m.is_workflow_bot,
};

const userPresenceMapper = (client: WebClient) => async (member: Member) => {
  const userPresence = await client.users.getPresence({
    user: member.id!,
  });

  return {
    ...member,
    presence: userPresence.ok ? { ...userPresence } : "unknown",

    // image: user.profile?.image_24,
    // name: `${user.profile?.real_name_normalized} (${user.profile?.display_name_normalized})`,
    // name: user.profile?.real_name_normalized,
    // tz: user.tz_label,
    // online: user.profile?.status_text === "Active",
    // title: user.profile?.title,
    // email: user.profile?.email,
    // phone: user.profile?.phone,
    // status: user.profile?.status_text,
    // status_expiration: user.profile?.status_expiration,
    // status_until: timeUntilStatusChange(
    //   new Date(user.profile?.status_expiration || Date.now())
    // ),
    // huddle: user.profile?.huddle_state === "huddle"? "yes 🎧" : "no",
    // is_in_a_huddle: user.profile?.huddle_state === "huddle",
  };
};

export default (): Middleware<SlackCommandMiddlewareArgs> => {
  return async ({ ack, body, client, command, logger, payload, respond }) => {
    // Acknowledge command request
    await ack({
      response_type: "ephemeral",
      text: "*Working on it...* :hourglass_flowing_sand: ",
      replace_original: true,
      delete_original: true,
      as_user: true,
    });

    // await respond({
    //   response_type: "ephemeral",
    //   text: "*Working on it...* :hourglass_flowing_sand: ",
    //   as_user: true,
    // });

    // Log command request on CloudWatch
    logger.debug("BODY", JSON.stringify(body, null, 2));
    logger.debug("COMMAND", JSON.stringify(command, null, 2));
    logger.debug("PAYLOAD", JSON.stringify(payload, null, 2));
    logger.debug("PAYLOAD::TEXT", payload.text);

    // Get all users
    const users = await client.users.list();

    // When something goes wrong, respond with a generic error message
    if (!users.ok) {
      await respond({
        response_type: "ephemeral",
        text: "Something went wrong! Please try again later.",
        replace_original: true,
        delete_original: true,
        as_user: true,
      });
    }

    const activeUsers = array.filterByPredicate(
      users.members!,
      predicates.realActiveUsers,
      predicates.pragmaUsers
    );

    // Get all members presence (a.k.a. status -> active, away, etc.)
    const members = await Promise.all(
      activeUsers?.map(userPresenceMapper(client))
    );

    // TODO: remove this line
    logger.debug("MEMBERS", members);

    const response = members.map((m) => `${m.name} (${m.presence})`).join("\n");

    // Respond to the command request
    await respond({
      response_type: "ephemeral",
      // text: json.toFormattedString(members),
      text: response,
      replace_original: true,
      delete_original: true,
      as_user: true,
    });
  };
};
