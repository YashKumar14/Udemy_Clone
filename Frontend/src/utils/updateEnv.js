import fs from "fs";
import path from "path";
import { networkInterfaces } from "os";

// Determine current environment — default to 'development'
const mode = process.env.NODE_ENV || "development";

// Dynamically resolve env file (e.g., .env.development, .env.production)
const envFilePath = path.resolve(`./.env.${mode}`);

// Fallback to plain `.env` if specific one doesn’t exist
const fallbackEnvPath = path.resolve("./.env");
const finalEnvPath = fs.existsSync(envFilePath) ? envFilePath : fallbackEnvPath;

function getLocalIP() {
  const nets = networkInterfaces();
  for (const name of Object.keys(nets)) {
    for (const net of nets[name] || []) {
      if (net.family === "IPv4" && !net.internal) {
        return net.address;
      }
    }
  }
  return "127.0.0.1";
}

const localIP = getLocalIP();
const newEnvContent = `VITE_API_BACKEND_URL=http://${localIP}:5001/api`;

// Read existing .env
const existingEnv = fs.readFileSync(finalEnvPath, "utf-8").split("\n");

// Update the specific variable or add it if it doesn't exist
const updatedEnv = existingEnv.map((line) =>
  line.startsWith("VITE_API_BACKEND_URL=") ? newEnvContent : line
);

if (!updatedEnv.includes(newEnvContent)) {
  updatedEnv.push(newEnvContent);
}

fs.writeFileSync(finalEnvPath, updatedEnv.join("\n"));
console.log(`Updated .env file with IP: ${localIP}`);
