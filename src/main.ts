/// Slash Commands Imports
import local from "@/commands/local";
import skills from "@/commands/skills";
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
app.command("/local", local());
app.command("/skills", skills());
app.command("/whereabouts", whereabouts());

/// AWS Lambda Handler
export const handler: AwsHandler = async (event, context, callback) => {
  context.callbackWaitsForEmptyEventLoop = false;

  /** Immediate response for WarmUp plugin */
  if ("source" in event && event.source === "serverless-plugin-warmup") {
    console.log("WarmUp - Lambda is warm!");
    return "Lambda is warm!" as unknown as AwsResponse;
  }

  const lambdaHandler = await awsLambdaReceiver.start();
  return lambdaHandler(event, context, callback);
};
