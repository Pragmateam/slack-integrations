import GoogleSheets from "@googleapis/sheets";
import type { Middleware, SlackCommandMiddlewareArgs } from "@slack/bolt";

const auth = new GoogleSheets.auth.GoogleAuth({
  keyFilename: "PATH_TO_SERVICE_ACCOUNT_KEY.json",
  // Scopes can be specified either as an array or as a single, space-delimited string.
  scopes: ["https://www.googleapis.com/auth/documents"],
});

export default (): Middleware<SlackCommandMiddlewareArgs> => {
  return async ({ ack, body, command, logger, payload, respond }) => {
    // Acknowledge command request
    await ack();

    // Log command request on CloudWatch
    console.log("BODY", JSON.stringify(body));
    console.log("COMMAND", JSON.stringify(command));
    console.log("PAYLOAD", JSON.stringify(payload));
    console.log("PAYLOAD::TEXT", payload.text);

    const authClient = await auth.getClient();

    const client = GoogleSheets.sheets({
      version: "v4",
      auth: authClient,
    });

    const createResponse = await client.spreadsheets.get({
      ranges: [],
      spreadsheetId: "",
    });

    logger.debug("CREATE_RESPONSE", createResponse);

    // Respond to the command request
    await respond("It works!");
  };
};
