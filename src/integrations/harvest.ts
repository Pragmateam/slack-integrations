import Harvest from "harvest";
import { TimeEntry } from "harvest/dist/models/timeEntries.models";
import { map, partialRight, pick, uniqBy } from "lodash";

const USER_AGENT = "PragmaTeam Slack Integrations (Avacado) v1";
const HARVEST_CLIENTS = new Map<string, Harvest>();
const COMMON_ENTRIES: FilteredTimeEntry[] = [
  {
    task: { id: 16967139, name: "Support (non-billable)" },
    project: { id: 33930496, name: "Media Platform Build", code: "" },
    client: { id: 12489588, name: "Ausbiz", currency: "AUD" },
  },
  {
    task: { id: 5322337, name: "Public Holiday" },
    project: { id: 30887496, name: "Internal (monthly)", code: "" },
    client: { id: 4082762, name: "Pragmateam", currency: "AUD" },
  },
  {
    task: { id: 5322327, name: "Annual Leave" },
    project: { id: 30887496, name: "Internal (monthly)", code: "" },
    client: { id: 4082762, name: "Pragmateam", currency: "AUD" },
  },
];

export const getLatestTasks = async (
  account_id: string,
  access_token: string
): Promise<FilteredTimeEntry[]> => {
  const client = getHarvestClient(account_id, access_token);
  const entries = (
    await client.timeEntries.list({
      per_page: 60, // Get last 2-3 months of entries to allow for long holidays etc.
      page: 1,
    })
  ).time_entries;

  const uniqueTasks = uniqBy(entries, "task.id");
  const latestTasks = map(
    uniqueTasks,
    partialRight(pick, ["task", "project", "client"])
  );

  return uniqBy(
    [...latestTasks, ...COMMON_ENTRIES],
    "task.id"
  ) as FilteredTimeEntry[];
};

const getHarvestClient = (
  account_id: string,
  access_token: string
): Harvest => {
  if (HARVEST_CLIENTS.has(account_id)) {
    // Hacky but TS doesn't trust that `has` actually works
    return HARVEST_CLIENTS.get(account_id) as Harvest;
  }
  const client = new Harvest({
    userAgent: USER_AGENT,
    auth: {
      accessToken: access_token,
      accountId: account_id,
    },
    subdomain: "pragmateam",
  });

  HARVEST_CLIENTS.set(account_id, client);
  return client;
};

export type FilteredTimeEntry = Pick<TimeEntry, "task" | "project" | "client">;

export type AvacadoUser = {
  slackID: string;
  harvestAccountID: string;
  harvestPAT: string;
};
