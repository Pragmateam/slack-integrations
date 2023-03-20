import type { App, Middleware, SlackCommandMiddlewareArgs } from "@slack/bolt";

export default (_app: App): Middleware<SlackCommandMiddlewareArgs> =>
  async ({ ack, body, command, payload, respond }) => {
    // Log command request on CloudWatch
    console.log("BODY", JSON.stringify(body));
    console.log("COMMAND", JSON.stringify(command));
    console.log("PAYLOAD", JSON.stringify(payload));
    console.log("PAYLOAD::TEXT", payload.text);

    // Acknowledge command request
    await ack();

    // Respond to the command request
    await respond("It works!");
  };
