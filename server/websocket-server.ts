import { WebSocketServer as WSServer, WebSocket } from "ws";
import type { Server as HttpServer } from "http";
import type { CommandQueue } from "./queue.js";
import type { TaggedCommand, WebSocketMessage } from "../types/types.js";

export interface WebSocketServerConfig {
  queue: CommandQueue;
}

export class WebSocketServer {
  private wss: WSServer | null = null;
  private client: WebSocket | null = null;
  private queue: CommandQueue;

  constructor(config: WebSocketServerConfig) {
    this.queue = config.queue;

    this.queue.on("command", (cmd: TaggedCommand) => {
      this.sendCommands([cmd]);
    });

    this.queue.on("commands-batch", (cmds: TaggedCommand[]) => {
      this.sendCommands(cmds);
    });
  }

  start(httpServer: HttpServer): void {
    this.wss = new WSServer({ server: httpServer });

    this.wss.on("connection", (ws: WebSocket) => {
      console.error("[WebSocket] Figma plugin connected");
      this.client = ws;
      this.queue.setConnected(true);

      ws.on("message", (data: Buffer) => {
        this.handleMessage(data);
      });

      ws.on("close", () => {
        console.error("[WebSocket] Figma plugin disconnected");
        this.client = null;
        this.queue.setConnected(false);
      });

      ws.on("error", (error) => {
        console.error("[WebSocket] Error:", error);
      });
    });

    this.wss.on("error", (error) => {
      console.error("[WebSocket] Server error:", error);
    });
  }

  private handleMessage(data: Buffer): void {
    try {
      const msg = JSON.parse(data.toString()) as WebSocketMessage;
      if (msg.type === "results" && msg.results) {
        console.error(`[WebSocket] Received ${msg.results.length} results`);
        msg.results.forEach((result) => {
          this.queue.resolveCommand(result._cmdId || "", result);
        });
      }
    } catch (e) {
      console.error("[WebSocket] Error parsing message:", e);
    }
  }

  private sendCommands(commands: TaggedCommand[]): void {
    if (this.client?.readyState === WebSocket.OPEN) {
      this.client.send(JSON.stringify({ type: "commands", commands }));
    }
  }

  isConnected(): boolean {
    return this.client?.readyState === WebSocket.OPEN || false;
  }

  async close(): Promise<void> {
    if (this.client) {
      this.client.close();
      this.client = null;
    }
    if (this.wss) {
      return new Promise((resolve) => {
        this.wss!.close(() => {
          this.wss = null;
          resolve();
        });
      });
    }
  }
}
