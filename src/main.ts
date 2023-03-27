/// Slash Commands Imports
import whereabouts from "@/commands/whereabouts";

/// App Imports
import app, {
  AwsHandler,
  awsLambdaReceiver,
  AwsResponse,
  errorHandler,
} from "@/app";

/// Error Handler
app.error(errorHandler);

/// Commands
app.command("/whereabouts", whereabouts());

/// AWS Lambda Handler
export const handler: AwsHandler = async (event, context, callback) => {
  /** Immediate response for WarmUp plugin */
  if (context.custom.source === "serverless-plugin-warmup") {
    console.log("WarmUp - Lambda is warm!");
    return "Lambda is warm!" as unknown as AwsResponse;
  }

  const lambdaHandler = await awsLambdaReceiver.start();
  return lambdaHandler(event, context, callback);
};
