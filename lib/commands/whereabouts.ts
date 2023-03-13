import type { App, Middleware, SlackCommandMiddlewareArgs } from "@slack/bolt";

export default (app: App): Middleware<SlackCommandMiddlewareArgs>[] => [
  async ({ ack, respond }) => {
    // Acknowledge command request
    await ack();

    // Get all users presence
    const usersPresence = await app.client.users.getPresence();
    const usersPresenceDataJson = JSON.parse(usersPresence as any);

    // Respond to the command request
    await respond(usersPresenceDataJson);
  },
];
