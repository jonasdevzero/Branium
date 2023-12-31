import { generateErrorMessage } from "@lib/zod-error";
import { getEnvIssues } from "./env";

const issues = getEnvIssues();

if (issues) {
  console.error("Invalid environment variables!");
  console.error(
    generateErrorMessage(issues, {
      delimiter: { error: "\\n" },
    })
  );
  process.exit(-1);
}
