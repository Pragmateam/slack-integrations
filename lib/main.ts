import { App, AwsLambdaReceiver, LogLevel } from "@slack/bolt";
import {
  AwsCallback,
  AwsEvent,
} from "@slack/bolt/dist/receivers/AwsLambdaReceiver";

import env from "./env";

/// Commands
import whereabouts from "./commands/whereabouts";

// Initializes your receiver with your app's signing secret
const awsLambdaReceiver = new AwsLambdaReceiver({
  signingSecret: env.SLACK_SIGNING_SECRET,
});

// Initializes your app with your bot token and the AWS Lambda ready receiver
const app = new App({
  token: env.SLACK_BOT_TOKEN,
  receiver: awsLambdaReceiver,
  logLevel: LogLevel.DEBUG,
  processBeforeResponse: true,
});

// Listen for slash commands
app.command("/whereabouts", whereabouts(app));

// Handle the Lambda function event
export const handler = async (event: AwsEvent, ctx: any, cb: AwsCallback) => {
  const handler = await awsLambdaReceiver.start();
  return handler(event, ctx, cb);
};
