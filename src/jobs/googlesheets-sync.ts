import * as json from "@/utils/json";
import GoogleSheets from "@googleapis/sheets";

const GoogleAuth = new GoogleSheets.auth.GoogleAuth({
  keyFilename: "PATH_TO_SERVICE_ACCOUNT_KEY.json",
  // Scopes can be specified either as an array or as a single, space-delimited string.
  scopes: ["https://www.googleapis.com/auth/documents"],
});

/// AWS Lambda Job Handler
export const job: LambdaHandler = async (event, context) => {
  console.log(`Event: ${json.toFormattedString(event)}`);
  console.log(`Context: ${json.toFormattedString(context)}`);

  const AuthClient = await GoogleAuth.getClient();

  const client = GoogleSheets.sheets({
    version: "v4",
    auth: AuthClient,
  });

  const skillMatrixSpreadsheet = await client.spreadsheets.get({
    ranges: [],
    spreadsheetId: "",
  });

  skillMatrixSpreadsheet.data.sheets?.forEach((sheet) => {
    console.log("SHEET", sheet.properties?.title);
    console.log("SHEET DATA", sheet.data);

    sheet.data?.forEach((data) => {
      console.log("DATA", data.rowData);

      data.rowData?.forEach((row) => {
        console.log("ROW", row.values);

        row.values?.forEach((value) => {
          console.log("VALUE", value);
        });
      });
    });
  });

  return {
    statusCode: 200,
    body: JSON.stringify(skillMatrixSpreadsheet.data.sheets),
  };
};
