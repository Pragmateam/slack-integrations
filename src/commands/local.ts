import type { Middleware, SlackCommandMiddlewareArgs } from "@slack/bolt";

export default (): Middleware<SlackCommandMiddlewareArgs> => {
  return async ({ ack, body, command, logger, payload, respond }) => {
    // Log command request on CloudWatch
    logger.info("BODY", JSON.stringify(body, null, 2));
    logger.info("COMMAND", JSON.stringify(command, null, 2));
    logger.info("PAYLOAD", JSON.stringify(payload, null, 2));
    logger.info("PAYLOAD::TEXT", payload.text);

    // Acknowledge command request
    await ack();

    // Respond to the command request
    await respond({
      response_type: "ephemeral",
      text: "It works!",
      as_user: true,
    });
  };
};
