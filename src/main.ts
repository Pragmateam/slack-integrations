/// Slash Commands Imports
import whereabouts from "@/commands/whereabouts";

import app, { AwsHandler, awsLambdaReceiver, errorHandler } from "@/app";

/// AWS Lambda Handler
export const handler: AwsHandler = async (event, context, callback) => {
  const handler = await awsLambdaReceiver.start();
  return handler(event, context, callback);
};

/// Error Handler
app.error(errorHandler);

/// Commands
app.command("/whereabouts", whereabouts(app));
app.command("/local", whereabouts(app));
