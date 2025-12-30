import WebSocket from "ws";
import { randomUUID } from "crypto";
import type { CommandQueue } from "./queue.js";
import type { TaggedCommand, WebSocketMessage } from "../types/messages.js";

export interface WebSocketClientConfig {
  queue: CommandQueue;
  url: string;
}

/**
 * WebSocket client for secondary MCP instances.
 * Connects to a primary MCP server's WebSocket and relays commands through it.
 */
export class WebSocketClient {
  private ws: WebSocket | null = null;
  private queue: CommandQueue;
  private url: string;
  private relayId: string;
  private connected = false;
  private figmaConnected = false;
  private reconnectTimeout: NodeJS.Timeout | null = null;
  private pendingCommands: TaggedCommand[] = [];

  constructor(config: WebSocketClientConfig) {
    this.queue = config.queue;
    this.url = config.url;
    this.relayId = `relay-${randomUUID().slice(0, 8)}`;

    this.queue.on("command", (cmd: TaggedCommand) => {
      this.sendCommands([cmd]);
    });

    this.queue.on("commands-batch", (cmds: TaggedCommand[]) => {
      this.sendCommands(cmds);
    });
  }

  async connect(): Promise<void> {
    return new Promise((resolve, reject) => {
      const connectTimeout = setTimeout(() => {
        reject(new Error(`Connection timeout to ${this.url}`));
      }, 10000);

      try {
        this.ws = new WebSocket(this.url);

        this.ws.on("open", () => {
          clearTimeout(connectTimeout);
          console.error(`[WebSocketClient] Connected to primary server at ${this.url}`);
          this.connected = true;

          // Register as relay client
          this.ws!.send(JSON.stringify({
            type: "relay-register",
            relayId: this.relayId
          }));

          // Send any pending commands
          if (this.pendingCommands.length > 0) {
            this.sendCommands(this.pendingCommands);
            this.pendingCommands = [];
          }

          resolve();
        });

        this.ws.on("message", (data: Buffer) => {
          this.handleMessage(data);
        });

        this.ws.on("close", () => {
          console.error("[WebSocketClient] Disconnected from primary server");
          this.connected = false;
          this.figmaConnected = false;
          this.queue.setConnected(false);
          this.scheduleReconnect();
        });

        this.ws.on("error", (error) => {
          clearTimeout(connectTimeout);
          console.error("[WebSocketClient] Error:", error.message);
          if (!this.connected) {
            reject(error);
          }
        });
      } catch (e) {
        clearTimeout(connectTimeout);
        reject(e);
      }
    });
  }

  private scheduleReconnect(): void {
    if (this.reconnectTimeout) return;

    console.error("[WebSocketClient] Scheduling reconnect in 5s...");
    this.reconnectTimeout = setTimeout(async () => {
      this.reconnectTimeout = null;
      try {
        await this.connect();
      } catch (e) {
        console.error("[WebSocketClient] Reconnect failed:", (e as Error).message);
        this.scheduleReconnect();
      }
    }, 5000);
  }

  private handleMessage(data: Buffer): void {
    try {
      const msg = JSON.parse(data.toString()) as WebSocketMessage;

      // Handle connection status updates from primary
      if (msg.type === "connection-status" && typeof msg.connected === "boolean") {
        console.error(`[WebSocketClient] Figma connection status: ${msg.connected}`);
        this.figmaConnected = msg.connected;
        this.queue.setConnected(msg.connected);
        return;
      }

      // Handle results relayed back from primary
      if (msg.type === "relay-results" && msg.results) {
        console.error(`[WebSocketClient] Received ${msg.results.length} results`);
        msg.results.forEach((result) => {
          this.queue.resolveCommand(result._cmdId || "", result);
        });
      }
    } catch (e) {
      console.error("[WebSocketClient] Error parsing message:", e);
    }
  }

  private sendCommands(commands: TaggedCommand[]): void {
    if (!this.connected || this.ws?.readyState !== WebSocket.OPEN) {
      console.error(`[WebSocketClient] Not connected, queuing ${commands.length} commands`);
      this.pendingCommands.push(...commands);
      return;
    }

    console.error(`[WebSocketClient] Sending ${commands.length} commands via relay`);
    this.ws.send(JSON.stringify({
      type: "relay-commands",
      relayId: this.relayId,
      commands
    }));
  }

  isConnected(): boolean {
    return this.figmaConnected;
  }

  async close(): Promise<void> {
    if (this.reconnectTimeout) {
      clearTimeout(this.reconnectTimeout);
      this.reconnectTimeout = null;
    }
    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
    this.connected = false;
    this.figmaConnected = false;
  }
}
