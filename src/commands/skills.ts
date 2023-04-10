import { toFormattedString } from "@/utils/json";
import type { Middleware, SlackCommandMiddlewareArgs } from "@slack/bolt";

export default (): Middleware<SlackCommandMiddlewareArgs> => {
  return async ({ ack, body, command, logger, payload, respond }) => {
    // Log command request on CloudWatch
    logger.info("BODY", toFormattedString(body));
    logger.info("COMMAND", toFormattedString(command));
    logger.info("PAYLOAD", toFormattedString(payload));
    logger.info("PAYLOAD::TEXT", payload.text);

    // Acknowledge command request
    await ack();

    // Respond to the command request
    await respond("It works!");
  };
};
