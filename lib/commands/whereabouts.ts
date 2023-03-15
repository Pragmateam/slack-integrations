import type { App, Middleware, SlackCommandMiddlewareArgs } from "@slack/bolt";

export default (_app: App): Middleware<SlackCommandMiddlewareArgs> =>
  async ({ ack, body, command, payload, respond }) => {
    // Log command request on CloudWatch
    console.log(JSON.stringify({ body, command, payload }));

    // Acknowledge command request
    await ack();

    // Get all users presence
    // const usersPresence = await app.client.users.getPresence();
    // const usersPresenceDataJson = JSON.parse(usersPresence as any);

    // Respond to the command request
    // await respond(usersPresenceDataJson);
    await respond(JSON.stringify({ body, command, payload }));
  };
