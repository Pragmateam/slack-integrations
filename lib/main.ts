import { App, AwsLambdaReceiver, LogLevel } from "@slack/bolt";
import env from "./env";

// Initializes your receiver with your app's signing secret
const awsLambdaReceiver = new AwsLambdaReceiver({
  signingSecret: env.SLACK_SIGNING_SECRET,
});

// Initializes your app with your bot token and the AWS Lambda ready receiver
const app = new App({
  token: env.SLACK_BOT_TOKEN,
  receiver: awsLambdaReceiver,
  logLevel: LogLevel.WARN,
  processBeforeResponse: true,
});

// Listen for slash commands
app.command("/whereabouts", require("./commands/whereabouts")(app));

// Handle the Lambda function event
module.exports.handler = async (event, context, callback) => {
  const handler = await awsLambdaReceiver.start();
  return handler(event, context, callback);
};
