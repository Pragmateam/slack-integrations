import { LogLevel } from "@slack/web-api";
import { z } from "zod";

export const envSchema = z.object({
  SLACK_SIGNING_SECRET: z.string().nonempty(),
  SLACK_BOT_TOKEN: z.string().nonempty(),
  LOG_LEVEL: z
    .enum([LogLevel.DEBUG, LogLevel.INFO, LogLevel.WARN, LogLevel.ERROR])
    .default(LogLevel.INFO)
    .optional(),
});

export default envSchema.parse(process.env);
