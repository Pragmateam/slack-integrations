/// Slash Commands Imports
import whereabouts from "@/commands/whereabouts";

/// App Imports
import app, { AwsHandler, awsLambdaReceiver, errorHandler } from "@/app";

/// Error Handler
app.error(errorHandler);

/// Commands
app.command("/whereabouts", whereabouts(app));

/// AWS Lambda Handler
export const handler: AwsHandler = async (event, context, callback) => {
  const lambdaHandler = await awsLambdaReceiver.start();
  return lambdaHandler(event, context, callback);
};
