import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { CallToolRequestSchema, ListToolsRequestSchema } from "@modelcontextprotocol/sdk/types.js";
import type { CommandQueue } from "./queue.js";
import { toolDefinitions } from "./tools/definitions.js";
import { handleToolCall } from "./tools/handlers.js";

export interface McpServerConfig {
  queue: CommandQueue;
  getConnectionStatus: () => boolean;
}

export class McpServer {
  private server: Server;
  private queue: CommandQueue;
  private getConnectionStatus: () => boolean;

  constructor(config: McpServerConfig) {
    this.queue = config.queue;
    this.getConnectionStatus = config.getConnectionStatus;

    this.server = new Server(
      {
        name: "figma-mcp-bridge",
        version: "1.0.0",
      },
      {
        capabilities: {
          tools: {},
        },
      }
    );

    this.setupHandlers();
  }

  private setupHandlers(): void {
    this.server.setRequestHandler(ListToolsRequestSchema, async () => ({
      tools: toolDefinitions,
    }));

    this.server.setRequestHandler(CallToolRequestSchema, async (request) => {
      const { name, arguments: args } = request.params;
      const result = await handleToolCall(
        name,
        args as Record<string, unknown> | undefined,
        this.queue,
        this.getConnectionStatus
      );
      return {
        content: result.content.map((c) => ({ type: "text" as const, text: c.text })),
        isError: result.isError,
      };
    });
  }

  async start(): Promise<void> {
    const transport = new StdioServerTransport();
    await this.server.connect(transport);
    console.error("[MCP] Server started");
  }

  async close(): Promise<void> {
    await this.server.close();
  }
}
