import { APIGatewayEvent, APIGatewayProxyResult, Handler } from "aws-lambda";

declare global {
  export type LambdaHandler = Handler<APIGatewayEvent, APIGatewayProxyResult>;
}
