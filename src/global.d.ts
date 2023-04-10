import { AllMiddlewareArgs } from "@slack/bolt";
import { StringIndexed } from "@slack/bolt/dist/types/helpers";
import { APIGatewayEvent, APIGatewayProxyResult, Handler } from "aws-lambda";

declare global {
  export type LambdaHandler = Handler<APIGatewayEvent, APIGatewayProxyResult>;

  export type CommandHandlerArgs = Omit<
    SlackCommandMiddlewareArgs & AllMiddlewareArgs<StringIndexed>,
    "ack"
  >;
}
