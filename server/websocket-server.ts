import { WebSocketServer as WSServer, WebSocket } from "ws";
import type { Server as HttpServer } from "http";
import type { CommandQueue } from "./queue.js";
import type { TaggedCommand, WebSocketMessage } from "../types/messages.js";

export interface WebSocketServerConfig {
  queue: CommandQueue;
}

interface RelayClient {
  ws: WebSocket;
  id: string;
}

export class WebSocketServer {
  private wss: WSServer | null = null;
  private figmaClient: WebSocket | null = null;
  private relayClients = new Map<string, RelayClient>();
  // Map cmdId -> relayId for routing results back
  private commandToRelay = new Map<string, string>();
  private queue: CommandQueue;

  constructor(config: WebSocketServerConfig) {
    this.queue = config.queue;

    this.queue.on("command", (cmd: TaggedCommand) => {
      this.sendCommandsToFigma([cmd]);
    });

    this.queue.on("commands-batch", (cmds: TaggedCommand[]) => {
      this.sendCommandsToFigma(cmds);
    });
  }

  start(httpServer: HttpServer): void {
    this.wss = new WSServer({ server: httpServer });

    this.wss.on("connection", (ws: WebSocket) => {
      // Don't assign yet - wait for first message to determine client type
      console.error("[WebSocket] New connection, waiting for identification...");

      const identifyTimeout = setTimeout(() => {
        // If no relay-register message, assume it's Figma
        if (!this.isRelayClient(ws)) {
          this.registerFigmaClient(ws);
        }
      }, 1000);

      ws.on("message", (data: Buffer) => {
        this.handleMessage(ws, data, identifyTimeout);
      });

      ws.on("close", () => {
        clearTimeout(identifyTimeout);
        this.handleDisconnect(ws);
      });

      ws.on("error", (error) => {
        console.error("[WebSocket] Error:", error);
      });
    });

    this.wss.on("error", (error) => {
      console.error("[WebSocket] Server error:", error);
    });
  }

  private isRelayClient(ws: WebSocket): boolean {
    for (const relay of this.relayClients.values()) {
      if (relay.ws === ws) return true;
    }
    return false;
  }

  private registerFigmaClient(ws: WebSocket): void {
    console.error("[WebSocket] Figma plugin connected");
    this.figmaClient = ws;
    this.queue.setConnected(true);
    // Notify all relay clients that Figma is connected
    this.broadcastConnectionStatus(true);
  }

  private handleDisconnect(ws: WebSocket): void {
    if (ws === this.figmaClient) {
      console.error("[WebSocket] Figma plugin disconnected");
      this.figmaClient = null;
      this.queue.setConnected(false);
      this.broadcastConnectionStatus(false);
    } else {
      // Check if it's a relay client
      for (const [id, relay] of this.relayClients) {
        if (relay.ws === ws) {
          console.error(`[WebSocket] Relay client ${id} disconnected`);
          this.relayClients.delete(id);
          // Clean up any pending commands from this relay
          for (const [cmdId, relayId] of this.commandToRelay) {
            if (relayId === id) {
              this.commandToRelay.delete(cmdId);
            }
          }
          break;
        }
      }
    }
  }

  private broadcastConnectionStatus(connected: boolean): void {
    const msg = JSON.stringify({ type: "connection-status", connected });
    for (const relay of this.relayClients.values()) {
      if (relay.ws.readyState === WebSocket.OPEN) {
        relay.ws.send(msg);
      }
    }
  }

  private handleMessage(ws: WebSocket, data: Buffer, identifyTimeout?: NodeJS.Timeout): void {
    try {
      const msg = JSON.parse(data.toString()) as WebSocketMessage;

      // Handle relay client registration
      if (msg.type === "relay-register" && msg.relayId) {
        if (identifyTimeout) clearTimeout(identifyTimeout);
        console.error(`[WebSocket] Relay client registered: ${msg.relayId}`);
        this.relayClients.set(msg.relayId, { ws, id: msg.relayId });
        // Send current connection status
        ws.send(JSON.stringify({
          type: "connection-status",
          connected: this.figmaClient?.readyState === WebSocket.OPEN
        }));
        return;
      }

      // Handle relay commands (from secondary MCP instances)
      if (msg.type === "relay-commands" && msg.commands && msg.relayId) {
        console.error(`[WebSocket] Relay commands from ${msg.relayId}: ${msg.commands.length} commands`);
        // Track which relay sent each command
        msg.commands.forEach(cmd => {
          this.commandToRelay.set(cmd._cmdId, msg.relayId!);
        });
        // Forward to Figma
        this.sendCommandsToFigma(msg.commands);
        return;
      }

      // Handle results from Figma
      if (msg.type === "results" && msg.results) {
        console.error(`[WebSocket] Received ${msg.results.length} results from Figma`);

        // Route results back to appropriate destination
        const localResults: typeof msg.results = [];
        const relayResults = new Map<string, typeof msg.results>();

        msg.results.forEach((result) => {
          const cmdId = result._cmdId || "";
          const relayId = this.commandToRelay.get(cmdId);

          if (relayId) {
            // This result goes to a relay client
            if (!relayResults.has(relayId)) {
              relayResults.set(relayId, []);
            }
            relayResults.get(relayId)!.push(result);
            this.commandToRelay.delete(cmdId);
          } else {
            // This result is for the local queue
            localResults.push(result);
          }
        });

        // Resolve local results
        localResults.forEach((result) => {
          this.queue.resolveCommand(result._cmdId || "", result);
        });

        // Send results to relay clients
        for (const [relayId, results] of relayResults) {
          const relay = this.relayClients.get(relayId);
          if (relay && relay.ws.readyState === WebSocket.OPEN) {
            relay.ws.send(JSON.stringify({ type: "relay-results", results }));
          }
        }
      }
    } catch (e) {
      console.error("[WebSocket] Error parsing message:", e);
    }
  }

  private sendCommandsToFigma(commands: TaggedCommand[]): void {
    console.error(`[WebSocket] sendCommandsToFigma called with ${commands.length} commands, figmaClient readyState=${this.figmaClient?.readyState}, OPEN=${WebSocket.OPEN}`);
    if (this.figmaClient?.readyState === WebSocket.OPEN) {
      const message = JSON.stringify({ type: "commands", commands });
      console.error(`[WebSocket] Sending to Figma: ${message.substring(0, 200)}...`);
      this.figmaClient.send(message);
    } else {
      console.error(`[WebSocket] Cannot send - Figma not connected`);
    }
  }

  isConnected(): boolean {
    return this.figmaClient?.readyState === WebSocket.OPEN || false;
  }

  async close(): Promise<void> {
    if (this.figmaClient) {
      this.figmaClient.close();
      this.figmaClient = null;
    }
    for (const relay of this.relayClients.values()) {
      relay.ws.close();
    }
    this.relayClients.clear();
    this.commandToRelay.clear();
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
