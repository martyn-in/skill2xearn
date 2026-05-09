import { execSync } from "child_process";
import fs from "fs";

try {
  const content = fs.readFileSync("env_list.txt", "utf-8");
  const lines = content.split("\n");
  
  let currentKey = null;
  let currentValue = "";

  // Simple parser for the env_list.txt format which contains multiline values
  for (const line of lines) {
    if (line.includes("=") && !line.startsWith(" ")) {
      if (currentKey) {
        console.log(`Setting ${currentKey}...`);
        execSync(`npx convex env set ${currentKey} "${currentValue.trim()}" --prod`, { stdio: "inherit" });
      }
      const parts = line.split("=");
      currentKey = parts[0];
      currentValue = parts.slice(1).join("=") + "\n";
    } else if (currentKey) {
      currentValue += line + "\n";
    }
  }

  // Set the last key
  if (currentKey) {
    console.log(`Setting ${currentKey}...`);
    execSync(`npx convex env set ${currentKey} "${currentValue.trim()}" --prod`, { stdio: "inherit" });
  }
  
  console.log("All env variables set in PROD!");
} catch (e) {
  console.error("Error setting env vars:", e);
}
