import { toFormattedString } from "@/utils/json";
import type { Middleware, SlackCommandMiddlewareArgs } from "@slack/bolt";

export default (): Middleware<SlackCommandMiddlewareArgs> => {
  return async (args: CommandHandlerArgs) => {
    const { ack, body, command, payload, respond, logger } = args;

    // Log command request on CloudWatch
    logger.debug("BODY", toFormattedString(body));
    logger.debug("COMMAND", toFormattedString(command));
    logger.debug("PAYLOAD", toFormattedString(payload));
    logger.debug("PAYLOAD::TEXT", payload.text);

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
