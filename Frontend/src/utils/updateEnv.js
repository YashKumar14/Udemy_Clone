import fs from "fs";
import path from "path";
import { networkInterfaces } from "os";

const envFilePath = path.resolve("./.env");

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
const existingEnv = fs.readFileSync(envFilePath, "utf-8").split("\n");

// Update the specific variable or add it if it doesn't exist
const updatedEnv = existingEnv.map((line) =>
  line.startsWith("VITE_API_BACKEND_URL=") ? newEnvContent : line
);

if (!updatedEnv.includes(newEnvContent)) {
  updatedEnv.push(newEnvContent);
}

fs.writeFileSync(envFilePath, updatedEnv.join("\n"));
console.log(`Updated .env file with IP: ${localIP}`);
