import { execSync } from "node:child_process";
import path from "node:path";

const sqlFile = path.join(__dirname, "seed.sql");
execSync(`npx wrangler d1 execute nacho-index-db --local --file="${sqlFile}"`, {
  stdio: "inherit",
  cwd: path.join(__dirname, ".."),
});
console.log("No sample reviews seeded.");
