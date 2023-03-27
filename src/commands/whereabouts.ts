import * as array from "@/utils/array";
import * as json from "@/utils/json";
import type { App, Middleware, SlackCommandMiddlewareArgs } from "@slack/bolt";
import { Member } from "@slack/web-api/dist/response/UsersListResponse";

const PRAGMATEAM_EMAIL_DOMAIN = "@pragma.team";
// const PRAGMATEAM_TEAM_ID = "unknown";

const predicates = {
  activeUsers: (m: Member) => !m.deleted,

  // TODO: shall we filter by team id?
  pragmaUsers: (m: Member) =>
    m.profile?.email?.includes(PRAGMATEAM_EMAIL_DOMAIN),

  realUsers: (m: Member) => !m.is_app_user && !m.is_bot && !m.is_workflow_bot,
};

const activeUserPresenceMapper = (app: App) => async (member: Member) => {
  const userPresence = await app.client.users.getPresence({
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

export default (app: App): Middleware<SlackCommandMiddlewareArgs> => {
  return async ({ ack, body, command, logger, payload, respond }) => {
    // Log command request on CloudWatch
    logger.info("BODY", JSON.stringify(body, null, 2));
    logger.info("COMMAND", JSON.stringify(command, null, 2));
    logger.info("PAYLOAD", JSON.stringify(payload, null, 2));
    logger.info("PAYLOAD::TEXT", payload.text);

    // Acknowledge command request
    await ack();

    // Get all users
    const users = await app.client.users.list();

    // When something goes wrong, respond with a generic error message
    if (!users.ok) {
      await respond({
        response_type: "ephemeral",
        text: "Something went wrong! Please try again later.",
        as_user: true,
      });
    }

    const activeUsers = array.filterByPredicate(
      users.members!,
      predicates.activeUsers,
      predicates.pragmaUsers,
      predicates.realUsers
    );

    const activeUserPresenceMapperFn = activeUserPresenceMapper(app);

    // Get all members presence (a.k.a. status -> active, away, etc.)
    const members = await Promise.all(
      activeUsers?.map(activeUserPresenceMapperFn)
    );

    // TODO: remove this line
    logger.debug("MEMBERS", members);

    // Respond to the command request
    await respond({
      response_type: "ephemeral",
      text: json.toFormattedString(members),
      as_user: true,
    });
  };
};
