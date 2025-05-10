#!/usr/bin/env node

import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  CallToolRequestSchema,
  ListResourcesRequestSchema,
  ListToolsRequestSchema,
  ReadResourceRequestSchema,
} from "@modelcontextprotocol/sdk/types.js";

import { handleListResources, handleReadResource } from "./handlers/resources.js";
import { handleListTools, handleCallTool } from "./handlers/tools.js";

const server = new Server(
  {
    name: "attio-mcp-server",
    version: "0.0.2",
  },
  {
    capabilities: {
      resources: {},
      tools: {},
    },
  },
);

// Set up request handlers using imported functions
server.setRequestHandler(ListResourcesRequestSchema, handleListResources);
server.setRequestHandler(ReadResourceRequestSchema, handleReadResource);
server.setRequestHandler(ListToolsRequestSchema, handleListTools);
server.setRequestHandler(CallToolRequestSchema, handleCallTool);

// Main function
async function main() {
  try {
    if (!process.env.ATTIO_API_KEY) {
      throw new Error("ATTIO_API_KEY environment variable not found");
    }

    const transport = new StdioServerTransport();
    await server.connect(transport);
  } catch (error) {
    console.error("Error starting server:", error);
    process.exit(1);
  }
}

main().catch(error => {
  console.error("Unhandled error:", error);
  process.exit(1);
});