import { AvacadoUser } from "@/integrations/harvest";
import { DynamoDB } from "@fabienjuif/serverless-dynamodb-client";

const DB = new DynamoDB.DocumentClient({
  accessKeyId: "fake-key",
  endpoint: "http://localhost:8000",
  region: "local",
  secretAccessKey: "fake-secret",
}); // Could move this to lambda handler and pass in to functions to cache it

const AVACADO_TABLE_NAME = "avacadoUsersTable";
export const getAllAvacadoUsers = async (): Promise<AvacadoUser[]> => {
  const users = await DB.scan({
    TableName: AVACADO_TABLE_NAME,
  }).promise();

  if (users.Count === 0) {
    return [];
  }

  const avacadoUsers = users.Items!.map((v) => {
    return {
      slackID: v.slackID,
      harvestAccountID: v.harvestID,
      harvestPAT: v.harvestPAT,
    };
  });

  return avacadoUsers;
};

export const addAvacadoUser = async (user: AvacadoUser): Promise<boolean> => {
  try {
    const response = await DB.put({
      TableName: AVACADO_TABLE_NAME,
      Item: {
        slackID: user.slackID,
        harvestID: user.harvestAccountID,
        harvestPAT: user.harvestPAT,
      },
    }).promise();
    return true;
  } catch (e) {
    console.error(e);
    return false;
  }
};
