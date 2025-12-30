#!/usr/bin/env node
import { createServer } from "http";
import { CommandQueue } from "./queue.js";
import { WebSocketServer } from "./websocket-server.js";
import { McpServer } from "./mcp-server.js";

const HTTP_PORT = 3456;

async function main() {
  const queue = new CommandQueue();

  const httpServer = createServer((req, res) => {
    if (req.url === "/health" && req.method === "GET") {
      const status = queue.getStatus();
      res.writeHead(200, { "Content-Type": "application/json" });
      res.end(
        JSON.stringify({
          status: "ok",
          figmaConnected: status.isConnected,
          pendingCommands: status.pendingCount,
        })
      );
      return;
    }

    res.writeHead(404);
    res.end();
  });

  const wsServer = new WebSocketServer({ queue });
  wsServer.start(httpServer);

  httpServer.listen(HTTP_PORT, () => {
    console.error(`[Figma MCP Bridge] HTTP/WebSocket server on port ${HTTP_PORT}`);
  });

  const mcpServer = new McpServer({
    queue,
    getConnectionStatus: () => wsServer.isConnected(),
  });

  await mcpServer.start();
  console.error("[Figma MCP Bridge] Ready");

  process.on("SIGINT", async () => {
    console.error("[Figma MCP Bridge] Shutting down...");
    await wsServer.close();
    await mcpServer.close();
    httpServer.close();
    process.exit(0);
  });

  process.on("SIGTERM", async () => {
    console.error("[Figma MCP Bridge] Shutting down...");
    await wsServer.close();
    await mcpServer.close();
    httpServer.close();
    process.exit(0);
  });
}

main().catch((error) => {
  console.error("[Figma MCP Bridge] Fatal error:", error);
  process.exit(1);
});
