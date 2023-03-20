import type { App, Middleware, SlackCommandMiddlewareArgs } from "@slack/bolt";

export default (app: App): Middleware<SlackCommandMiddlewareArgs> =>
  async ({ ack, body, command, payload, respond }) => {
    // Log command request on CloudWatch
    console.log("BODY", JSON.stringify(body));
    console.log("COMMAND", JSON.stringify(command));
    console.log("PAYLOAD", JSON.stringify(payload));
    console.log("PAYLOAD::TEXT", payload.text);

    // Acknowledge command request
    await ack();

    // Get all users presence
    const usersPresence = await app.client.users.getPresence();
    // console.log("USERS_PRESENCE", JSON.stringify(usersPresence));

    // const usersPresenceDataJson = JSON.stringify(usersPresence as any);
    // console.log(usersPresenceDataJson);
    // presence
    // Respond to the command request
    await respond(`${usersPresence.presence}`);
    // await respond(JSON.stringify({ body, command, payload }));
  };
