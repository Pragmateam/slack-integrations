import env from "@/env";
import { App, AwsLambdaReceiver } from "@slack/bolt";
import { ExtendedErrorHandler } from "@slack/bolt/dist/App";
import { ConsoleLogger } from "@slack/logger";

export type { AwsHandler } from "@slack/bolt/dist/receivers/AwsLambdaReceiver";
export type { AwsResponse } from "@slack/bolt/dist/receivers/AwsLambdaReceiver";

// Initializes your receiver with your app's signing secret
export const awsLambdaReceiver = new AwsLambdaReceiver({
  signingSecret: env.SLACK_SIGNING_SECRET,
});

/// App
export const app = new App({
  token: env.SLACK_BOT_TOKEN,
  logger: new ConsoleLogger(),
  logLevel: env.LOG_LEVEL,
  extendedErrorHandler: true,
  processBeforeResponse: true,
  receiver: awsLambdaReceiver,
});

/// Error Handler
export const errorHandler: ExtendedErrorHandler = async ({ error, logger }) => {
  // Log the error using the logger passed into Bolt
  logger.error(error.code, error.name, error.message, error.cause);
};

export default app;
