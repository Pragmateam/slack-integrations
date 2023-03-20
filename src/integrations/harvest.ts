import Harvest from 'harvest';
import { TimeEntry } from 'harvest/dist/models/timeEntries.models';
import { map, partialRight, pick, uniqBy } from 'lodash';

const USER_AGENT = "PragmaTeam Slack Integrations (Avacado) v1";
const HARVEST_CLIENTS = new Map<string, Harvest>();

export const getLatestTasks = async (account_id: string, access_token: string): Promise<FilteredTimeEntry[]> => {

  const client = getHarvestClient(account_id, access_token);
  const entries = (await client.timeEntries.list({
    per_page: 60, // Get last 2-3 months of entries to allow for long holidays etc.
    page: 1
  })).time_entries;

  const uniqueTasks = uniqBy(entries, 'task.id');
  const latestTasks = map(uniqueTasks, partialRight(pick, ['task', 'project', 'client']));

  return latestTasks as FilteredTimeEntry[];

}

const getHarvestClient = (account_id: string, access_token: string): Harvest => {
  if(HARVEST_CLIENTS.has(account_id)) {
    // Hacky but TS doesn't trust that `has` actually works
    return HARVEST_CLIENTS.get(account_id) as Harvest;
  }
  const client = new Harvest({
    userAgent: USER_AGENT,
    auth: {
      accessToken: access_token,
      accountId: account_id
    },
    subdomain: 'pragmateam'
  });

  HARVEST_CLIENTS.set(account_id, client);
  return client;

}

export type FilteredTimeEntry = Pick<TimeEntry, 'task' | 'project' | 'client'>;

