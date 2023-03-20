import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";

dayjs.extend(relativeTime);

export const timeUntilStatusChange = (date: Date) => {
  const now = dayjs();
  const statusExpiration = dayjs(date);
  return now.to(statusExpiration);
};
