#!/usr/bin/env node
import { createServer, Server as HttpServer } from "http";
import { CommandQueue } from "./queue.js";
import { WebSocketServer } from "./websocket-server.js";
import { WebSocketClient } from "./websocket-client.js";
import { McpServer } from "./mcp-server.js";

const HTTP_PORT = parseInt(process.env.FIGMA_MCP_PORT || "3456", 10);

interface ConnectionHandler {
  isConnected(): boolean;
  close(): Promise<void>;
}

async function tryStartServer(queue: CommandQueue): Promise<{ httpServer: HttpServer; wsServer: WebSocketServer } | null> {
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

  // Try to bind the port
  return new Promise((resolve) => {
    httpServer.once("error", (err: NodeJS.ErrnoException) => {
      if (err.code === "EADDRINUSE") {
        console.error(`[Figma MCP Bridge] Port ${HTTP_PORT} in use, will connect as relay client`);
        resolve(null);
      } else {
        console.error(`[Figma MCP Bridge] Server error: ${err.message}`);
        resolve(null);
      }
    });

    httpServer.listen(HTTP_PORT, () => {
      console.error(`[Figma MCP Bridge] Primary mode - HTTP/WebSocket server on port ${HTTP_PORT}`);
      resolve({ httpServer, wsServer });
    });
  });
}

async function connectAsClient(queue: CommandQueue): Promise<WebSocketClient> {
  const wsClient = new WebSocketClient({
    queue,
    url: `ws://localhost:${HTTP_PORT}`,
  });

  await wsClient.connect();
  console.error(`[Figma MCP Bridge] Relay mode - connected to primary server on port ${HTTP_PORT}`);
  return wsClient;
}

async function main() {
  const queue = new CommandQueue();

  let httpServer: HttpServer | null = null;
  let connectionHandler: ConnectionHandler;
  let mode: "primary" | "relay";

  // Try to start as primary server first
  const serverResult = await tryStartServer(queue);

  if (serverResult) {
    // We're the primary server
    httpServer = serverResult.httpServer;
    connectionHandler = serverResult.wsServer;
    mode = "primary";
  } else {
    // Port in use, connect as relay client
    try {
      connectionHandler = await connectAsClient(queue);
      mode = "relay";
    } catch (e) {
      console.error(`[Figma MCP Bridge] Failed to connect as relay client: ${(e as Error).message}`);
      process.exit(1);
    }
  }

  const mcpServer = new McpServer({
    queue,
    getConnectionStatus: () => connectionHandler.isConnected(),
    getMode: () => mode,
  });

  await mcpServer.start();
  console.error("[Figma MCP Bridge] Ready");

  const shutdown = async () => {
    console.error("[Figma MCP Bridge] Shutting down...");
    await connectionHandler.close();
    await mcpServer.close();
    if (httpServer) {
      httpServer.close();
    }
    process.exit(0);
  };

  process.on("SIGINT", shutdown);
  process.on("SIGTERM", shutdown);
}

main().catch((error) => {
  console.error("[Figma MCP Bridge] Fatal error:", error);
  process.exit(1);
});
