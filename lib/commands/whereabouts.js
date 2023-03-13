export default function (app) {
  return async ({ ack, respond }) => {
    // Acknowledge command request
    await ack();

    // Get all users presence
    const users = await app.client.users.getPresence();
    const usersPresenceDataJson = JSON.parse(users);

    // Respond to the command request
    await respond(usersPresenceDataJson);
  };
}
