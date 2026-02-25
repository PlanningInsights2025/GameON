import fs from "fs";
import path from "path";

const filePath = path.resolve(
  "node_modules",
  "tailwindcss",
  "lib",
  "cli",
  "build",
  "watching.js"
);

if (fs.existsSync(filePath)) {
  const content = fs.readFileSync(filePath, "utf8");
  if (content.startsWith("// @ts-check\n")) {
    fs.writeFileSync(filePath, content.replace("// @ts-check\n", ""), "utf8");
  }
}