#!/usr/bin/env node
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import * as dotenv from "dotenv";
import * as path from "path";
import createServer from "./index.js";

// Load .env from the project root
dotenv.config({ path: path.resolve(__dirname, "..", ".env") });

const config = {
  NAMECHEAP_API_KEY: process.env.NAMECHEAP_API_KEY || "",
  NAMECHEAP_API_USER: process.env.NAMECHEAP_API_USER || "",
  NAMECHEAP_CLIENT_IP: process.env.NAMECHEAP_CLIENT_IP || "",
  NAMECHEAP_USE_SANDBOX: process.env.NAMECHEAP_USE_SANDBOX === "true",
};

if (!config.NAMECHEAP_API_KEY || !config.NAMECHEAP_API_USER || !config.NAMECHEAP_CLIENT_IP) {
  console.error("Missing required environment variables: NAMECHEAP_API_KEY, NAMECHEAP_API_USER, NAMECHEAP_CLIENT_IP");
  process.exit(1);
}

const server = createServer({ config });

async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
}

main().catch((error) => {
  console.error("Fatal error:", error);
  process.exit(1);
});
