import { readFileSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";

const root = process.cwd();
const envPath = resolve(root, ".env");
const outputPath = resolve(root, "js/firebase-config.js");

function parseEnv(contents) {
  const values = {};
  for (const line of contents.split(/\r?\n/)) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const equalIndex = trimmed.indexOf("=");
    if (equalIndex === -1) continue;
    const key = trimmed.slice(0, equalIndex).trim();
    let value = trimmed.slice(equalIndex + 1).trim();
    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }
    values[key] = value;
  }
  return values;
}

const required = [
  "FIREBASE_API_KEY",
  "FIREBASE_AUTH_DOMAIN",
  "FIREBASE_PROJECT_ID",
  "FIREBASE_STORAGE_BUCKET",
  "FIREBASE_MESSAGING_SENDER_ID",
  "FIREBASE_APP_ID",
  "FIREBASE_MEASUREMENT_ID"
];

const envContents = readFileSync(envPath, "utf8");
const env = parseEnv(envContents);
const missing = required.filter((key) => !env[key]);

if (missing.length) {
  console.error(`Missing required .env values: ${missing.join(", ")}`);
  process.exit(1);
}

const output = `window.__FIREBASE_CONFIG__ = {
  apiKey: "${env.FIREBASE_API_KEY}",
  authDomain: "${env.FIREBASE_AUTH_DOMAIN}",
  projectId: "${env.FIREBASE_PROJECT_ID}",
  storageBucket: "${env.FIREBASE_STORAGE_BUCKET}",
  messagingSenderId: "${env.FIREBASE_MESSAGING_SENDER_ID}",
  appId: "${env.FIREBASE_APP_ID}",
  measurementId: "${env.FIREBASE_MEASUREMENT_ID}"
};
`;

writeFileSync(outputPath, output, "utf8");
console.log(`Generated ${outputPath}`);
