import { z } from "zod";

export const envSchema = z.object({
  SLACK_SIGNING_SECRET: z.string().nonempty(),
  SLACK_BOT_TOKEN: z.string().nonempty(),
});

export default envSchema.parse(process.env);
