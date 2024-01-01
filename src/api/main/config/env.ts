import "dotenv/config";
import z from "zod";

const envSchema = z.object({
  AUTHENTICATION_URL: z.string().url().default("https://localhost:5001"),
  MESSAGES_URL: z.string().url().default("https://localhost:4000"),
  KEY_EXCHANGE_URL: z.string().url().default("https://localhost:4040"),

  CERT: z.string(),
  KEY: z.string(),
  CA: z.string(),
});

export const ENV = envSchema.parse(process.env);

export const getEnvIssues = (): z.ZodIssue[] | void => {
  const result = envSchema.safeParse(process.env);
  if (!result.success) return result.error.issues;
};
