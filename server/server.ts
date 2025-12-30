#!/usr/bin/env node
import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from "@modelcontextprotocol/sdk/types.js";
import express, { Request, Response, NextFunction } from "express";
import { WebSocketServer, WebSocket } from "ws";
import type { Command, CommandType, CommandResult, WebSocketMessage } from "../types/types.js";

// Tagged command includes the internal _cmdId for tracking
type TaggedCommand = Command & { _cmdId: string };

// Store for pending commands and connected Figma clients
let figmaClient: WebSocket | null = null;
let pendingCommands: TaggedCommand[] = [];
let commandId = 0;
const pendingResolvers = new Map<string, (result: CommandResult) => void>();

// Create Express server for Figma plugin to connect
const app = express();
app.use(express.json());

// CORS for Figma plugin
app.use((req: Request, res: Response, next: NextFunction) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Content-Type");
  res.header("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  if (req.method === "OPTIONS") {
    res.sendStatus(200);
    return;
  }
  next();
});

// Health check
app.get("/health", (req: Request, res: Response) => {
  res.json({
    status: "ok",
    figmaConnected: figmaClient !== null,
    pendingCommands: pendingCommands.length
  });
});

// Endpoint for Figma to get commands
app.get("/commands", (req: Request, res: Response) => {
  const commands = pendingCommands.splice(0, pendingCommands.length);
  res.json({ commands });
});

// Endpoint for Figma to report results
app.post("/results", (req: Request, res: Response) => {
  const { results } = req.body as { results?: CommandResult[] };
  if (results && Array.isArray(results)) {
    results.forEach(result => {
      const resolver = pendingResolvers.get(result._cmdId || '');
      if (resolver) {
        resolver(result);
        pendingResolvers.delete(result._cmdId || '');
      }
    });
  }
  res.json({ ok: true });
});

// Start HTTP server
const HTTP_PORT = 3456;
const httpServer = app.listen(HTTP_PORT, () => {
  console.error(`[Figma MCP Bridge] HTTP server running on http://localhost:${HTTP_PORT}`);
});

// WebSocket server for real-time communication
const wss = new WebSocketServer({ server: httpServer });

wss.on("connection", (ws: WebSocket) => {
  console.error("[Figma MCP Bridge] Figma plugin connected via WebSocket");
  figmaClient = ws;

  ws.on("message", (data: Buffer) => {
    try {
      const msg = JSON.parse(data.toString()) as WebSocketMessage;
      if (msg.type === "results" && msg.results) {
        console.error("[Figma MCP Bridge] Received results:", msg.results.length);
        msg.results.forEach(result => {
          const cmdId = result._cmdId;
          const resolver = pendingResolvers.get(cmdId || '');
          if (resolver) {
            console.error("[Figma MCP Bridge] Resolving:", cmdId);
            resolver(result);
            pendingResolvers.delete(cmdId || '');
          } else {
            console.error("[Figma MCP Bridge] No resolver for:", cmdId);
          }
        });
      }
    } catch (e) {
      console.error("[Figma MCP Bridge] Error parsing message:", e);
    }
  });

  ws.on("close", () => {
    console.error("[Figma MCP Bridge] Figma plugin disconnected");
    figmaClient = null;
  });
});

// Helper to send commands to Figma
function sendToFigma(commands: Command[]): Promise<CommandResult[]> {
  return new Promise((resolve, reject) => {
    const id = ++commandId;
    const taggedCommands: TaggedCommand[] = commands.map((cmd, i) => ({
      ...cmd,
      _cmdId: `${id}-${i}`
    }));

    // Store resolvers for each command
    const results: CommandResult[] = [];
    let remaining = taggedCommands.length;

    taggedCommands.forEach((cmd) => {
      pendingResolvers.set(cmd._cmdId, (result) => {
        results.push(result);
        remaining--;
        if (remaining === 0) {
          resolve(results);
        }
      });
    });

    // Send via WebSocket if connected
    if (figmaClient && figmaClient.readyState === WebSocket.OPEN) {
      figmaClient.send(JSON.stringify({ type: "commands", commands: taggedCommands }));
    } else {
      // Fall back to polling queue
      pendingCommands.push(...taggedCommands);
    }

    // Timeout after 120 seconds
    setTimeout(() => {
      taggedCommands.forEach(cmd => {
        if (pendingResolvers.has(cmd._cmdId)) {
          pendingResolvers.delete(cmd._cmdId);
        }
      });
      if (remaining > 0) {
        reject(new Error("Timeout waiting for Figma response"));
      }
    }, 120000);
  });
}

// Create MCP server
const server = new Server(
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

// Define tools
server.setRequestHandler(ListToolsRequestSchema, async () => {
  return {
    tools: [
      {
        name: "figma_status",
        description: "Check if Figma plugin is connected",
        inputSchema: {
          type: "object" as const,
          properties: {},
          required: []
        }
      },
      {
        name: "figma_create_frame",
        description: "Create a frame in Figma. Frames are containers that can hold other elements.",
        inputSchema: {
          type: "object" as const,
          properties: {
            id: { type: "string", description: "Unique ID to reference this frame later" },
            name: { type: "string", description: "Name of the frame" },
            x: { type: "number", description: "X position" },
            y: { type: "number", description: "Y position" },
            width: { type: "number", description: "Width in pixels" },
            height: { type: "number", description: "Height in pixels" },
            fillColor: { type: "string", description: "Fill color as hex (e.g. #0C0F0E)" },
            cornerRadius: { type: "number", description: "Corner radius" },
            parent: { type: "string", description: "Parent frame ID to nest inside" },
            layout: {
              type: "object",
              description: "Auto-layout settings",
              properties: {
                direction: { type: "string", enum: ["HORIZONTAL", "VERTICAL"] },
                gap: { type: "number", description: "Spacing between children" },
                padding: { type: "number", description: "Padding on all sides" },
                paddingTop: { type: "number" },
                paddingRight: { type: "number" },
                paddingBottom: { type: "number" },
                paddingLeft: { type: "number" },
                primaryAlign: { type: "string", enum: ["MIN", "CENTER", "MAX", "SPACE_BETWEEN"] },
                counterAlign: { type: "string", enum: ["MIN", "CENTER", "MAX"] }
              }
            }
          },
          required: ["name", "width", "height"]
        }
      },
      {
        name: "figma_create_rectangle",
        description: "Create a rectangle shape in Figma",
        inputSchema: {
          type: "object" as const,
          properties: {
            id: { type: "string", description: "Unique ID to reference this rectangle" },
            name: { type: "string", description: "Name of the rectangle" },
            x: { type: "number", description: "X position" },
            y: { type: "number", description: "Y position" },
            width: { type: "number", description: "Width in pixels" },
            height: { type: "number", description: "Height in pixels" },
            fillColor: { type: "string", description: "Fill color as hex" },
            cornerRadius: { type: "number", description: "Corner radius" },
            strokeColor: { type: "string", description: "Stroke color as hex" },
            strokeWeight: { type: "number", description: "Stroke width" },
            parent: { type: "string", description: "Parent frame ID" }
          },
          required: ["name", "width", "height"]
        }
      },
      {
        name: "figma_create_ellipse",
        description: "Create an ellipse/circle shape in Figma",
        inputSchema: {
          type: "object" as const,
          properties: {
            id: { type: "string", description: "Unique ID" },
            name: { type: "string", description: "Name" },
            x: { type: "number" },
            y: { type: "number" },
            width: { type: "number", description: "Width (same as height for circle)" },
            height: { type: "number" },
            fillColor: { type: "string", description: "Fill color as hex" },
            parent: { type: "string", description: "Parent frame ID" }
          },
          required: ["name", "width", "height"]
        }
      },
      {
        name: "figma_create_text",
        description: "Create a text element in Figma",
        inputSchema: {
          type: "object" as const,
          properties: {
            id: { type: "string", description: "Unique ID" },
            name: { type: "string", description: "Layer name" },
            text: { type: "string", description: "The text content" },
            x: { type: "number" },
            y: { type: "number" },
            width: { type: "number", description: "Text box width (optional, auto-sizes if not set)" },
            fontFamily: { type: "string", description: "Font family (default: Inter)" },
            fontStyle: { type: "string", description: "Font style: Regular, Medium, SemiBold, Bold" },
            fontSize: { type: "number", description: "Font size in pixels" },
            lineHeight: { type: "number", description: "Line height in pixels" },
            letterSpacing: { type: "number", description: "Letter spacing" },
            fillColor: { type: "string", description: "Text color as hex" },
            textAlignHorizontal: { type: "string", enum: ["LEFT", "CENTER", "RIGHT", "JUSTIFIED"] },
            textCase: { type: "string", enum: ["ORIGINAL", "UPPER", "LOWER", "TITLE"] },
            parent: { type: "string", description: "Parent frame ID" }
          },
          required: ["text"]
        }
      },
      {
        name: "figma_create_component",
        description: "Create a reusable component in Figma",
        inputSchema: {
          type: "object" as const,
          properties: {
            id: { type: "string", description: "Unique ID to reference this component" },
            name: { type: "string", description: "Component name (use / for grouping, e.g. Button/Primary)" },
            x: { type: "number" },
            y: { type: "number" },
            width: { type: "number" },
            height: { type: "number" },
            fillColor: { type: "string", description: "Background color" },
            cornerRadius: { type: "number" },
            layout: {
              type: "object",
              description: "Auto-layout settings",
              properties: {
                direction: { type: "string", enum: ["HORIZONTAL", "VERTICAL"] },
                gap: { type: "number" },
                padding: { type: "number" },
                paddingTop: { type: "number" },
                paddingRight: { type: "number" },
                paddingBottom: { type: "number" },
                paddingLeft: { type: "number" },
                primaryAlign: { type: "string", enum: ["MIN", "CENTER", "MAX", "SPACE_BETWEEN"] },
                counterAlign: { type: "string", enum: ["MIN", "CENTER", "MAX"] }
              }
            }
          },
          required: ["name", "width", "height"]
        }
      },
      {
        name: "figma_create_instance",
        description: "Create an instance of a component",
        inputSchema: {
          type: "object" as const,
          properties: {
            id: { type: "string" },
            name: { type: "string" },
            componentId: { type: "string", description: "ID of the component to instantiate" },
            x: { type: "number" },
            y: { type: "number" },
            parent: { type: "string" }
          },
          required: ["componentId"]
        }
      },
      {
        name: "figma_create_line",
        description: "Create a line in Figma",
        inputSchema: {
          type: "object" as const,
          properties: {
            id: { type: "string" },
            name: { type: "string" },
            x: { type: "number" },
            y: { type: "number" },
            length: { type: "number", description: "Length of the line" },
            rotation: { type: "number", description: "Rotation in degrees" },
            color: { type: "string", description: "Line color as hex" },
            weight: { type: "number", description: "Stroke weight" },
            dashPattern: {
              type: "array",
              items: { type: "number" },
              description: "Dash pattern, e.g. [4, 4] for dashed line"
            },
            parent: { type: "string" }
          },
          required: ["length"]
        }
      },
      {
        name: "figma_create_variable_collection",
        description: "Create a variable collection for design tokens (colors, numbers, etc)",
        inputSchema: {
          type: "object" as const,
          properties: {
            id: { type: "string", description: "Unique ID to reference this collection" },
            name: { type: "string", description: "Collection name" },
            modes: {
              type: "array",
              items: { type: "string" },
              description: "Mode names, e.g. ['Dark', 'Light']"
            }
          },
          required: ["name", "modes"]
        }
      },
      {
        name: "figma_create_variable",
        description: "Create a variable (design token) in a collection",
        inputSchema: {
          type: "object" as const,
          properties: {
            id: { type: "string" },
            name: { type: "string", description: "Variable name" },
            collectionId: { type: "string", description: "ID of the variable collection" },
            resolvedType: { type: "string", enum: ["COLOR", "FLOAT", "STRING"], description: "Variable type" },
            values: {
              type: "object",
              description: "Values for each mode, e.g. { 'Dark': '#000', 'Light': '#fff' }"
            }
          },
          required: ["name", "collectionId", "resolvedType", "values"]
        }
      },
      {
        name: "figma_create_text_style",
        description: "Create a reusable text style",
        inputSchema: {
          type: "object" as const,
          properties: {
            id: { type: "string" },
            name: { type: "string", description: "Style name (use / for grouping)" },
            fontFamily: { type: "string" },
            fontStyle: { type: "string" },
            fontSize: { type: "number" },
            lineHeight: { type: "number" },
            letterSpacing: { type: "number" },
            textCase: { type: "string", enum: ["ORIGINAL", "UPPER", "LOWER", "TITLE"] }
          },
          required: ["name", "fontSize"]
        }
      },
      {
        name: "figma_create_color_style",
        description: "Create a reusable color/paint style",
        inputSchema: {
          type: "object" as const,
          properties: {
            id: { type: "string" },
            name: { type: "string", description: "Style name (use / for grouping)" },
            color: { type: "string", description: "Color as hex" }
          },
          required: ["name", "color"]
        }
      },
      {
        name: "figma_batch_commands",
        description: "Execute multiple Figma commands in a batch. Use this when creating multiple elements at once for better performance.",
        inputSchema: {
          type: "object" as const,
          properties: {
            commands: {
              type: "array",
              description: "Array of command objects. Each object should have a 'type' field (CREATE_FRAME, CREATE_RECTANGLE, CREATE_TEXT, etc) and the corresponding parameters.",
              items: {
                type: "object"
              }
            }
          },
          required: ["commands"]
        }
      },
      {
        name: "figma_create_tree",
        description: "Create a complex component tree with nested children in a single call. Each node can have a 'children' array containing child nodes. This is the most efficient way to create complex UI structures. Supports shorthand properties: 'fill' instead of 'fills', 'direction'/'gap'/'padding' at top level instead of nested in 'layout'. Frames with children automatically get auto-layout applied.",
        inputSchema: {
          type: "object" as const,
          properties: {
            tree: {
              type: "object",
              description: "Root node with nested children. Each node should have 'type' (CREATE_FRAME, CREATE_TEXT, CREATE_RECTANGLE, etc) and can have 'children' array.",
              properties: {
                type: { type: "string", description: "Node type: CREATE_FRAME, CREATE_RECTANGLE, CREATE_ELLIPSE, CREATE_TEXT, CREATE_COMPONENT, CREATE_LINE" },
                id: { type: "string", description: "Optional ID to reference this node later" },
                name: { type: "string", description: "Layer name" },
                x: { type: "number" },
                y: { type: "number" },
                width: { type: "number" },
                height: { type: "number" },
                fill: { type: "string", description: "Shorthand: fill color as hex (e.g. #1A1D1C)" },
                fillColor: { type: "string", description: "Alias for fill" },
                stroke: { type: "string", description: "Shorthand: stroke color as hex" },
                cornerRadius: { type: "number" },
                direction: { type: "string", enum: ["HORIZONTAL", "VERTICAL"], description: "Shorthand for layout direction" },
                gap: { type: "number", description: "Shorthand for layout gap/itemSpacing" },
                padding: { type: "number", description: "Shorthand for layout padding (all sides)" },
                paddingTop: { type: "number" },
                paddingRight: { type: "number" },
                paddingBottom: { type: "number" },
                paddingLeft: { type: "number" },
                align: { type: "string", enum: ["MIN", "CENTER", "MAX", "SPACE_BETWEEN"], description: "Shorthand for primaryAxisAlignItems" },
                counterAlign: { type: "string", enum: ["MIN", "CENTER", "MAX"], description: "Counter axis alignment" },
                layout: {
                  type: "object",
                  description: "Full layout config (optional, can use shorthand props instead)",
                  properties: {
                    direction: { type: "string", enum: ["HORIZONTAL", "VERTICAL"] },
                    gap: { type: "number" },
                    padding: { type: "number" },
                    paddingTop: { type: "number" },
                    paddingRight: { type: "number" },
                    paddingBottom: { type: "number" },
                    paddingLeft: { type: "number" },
                    primaryAlign: { type: "string", enum: ["MIN", "CENTER", "MAX", "SPACE_BETWEEN"] },
                    counterAlign: { type: "string", enum: ["MIN", "CENTER", "MAX"] }
                  }
                },
                text: { type: "string", description: "For CREATE_TEXT: the text content" },
                fontSize: { type: "number" },
                fontFamily: { type: "string" },
                fontStyle: { type: "string" },
                children: {
                  type: "array",
                  description: "Nested child nodes (auto-enables auto-layout on parent)",
                  items: { type: "object" }
                }
              },
              required: ["type"]
            }
          },
          required: ["tree"]
        }
      },
      {
        name: "figma_define_components",
        description: "Define multiple reusable components for a design system. Components are registered by ID for later instantiation. Components can nest instances of other components (dependencies are auto-resolved). Supports shorthand syntax.",
        inputSchema: {
          type: "object" as const,
          properties: {
            components: {
              type: "array",
              description: "Array of component definitions. Order doesn't matter - dependencies are auto-sorted.",
              items: {
                type: "object",
                properties: {
                  id: { type: "string", description: "Required: unique ID to reference this component when creating instances" },
                  name: { type: "string", description: "Component name (use / for grouping, e.g. 'Button/Primary')" },
                  x: { type: "number" },
                  y: { type: "number" },
                  width: { type: "number" },
                  height: { type: "number" },
                  fill: { type: "string", description: "Background color" },
                  stroke: { type: "string", description: "Stroke color as hex" },
                  strokeWeight: { type: "number", description: "Stroke width (default 1)" },
                  strokeAlign: { type: "string", enum: ["INSIDE", "OUTSIDE", "CENTER"], description: "Stroke alignment" },
                  dashPattern: { type: "array", items: { type: "number" }, description: "Dash pattern e.g. [4, 4]" },
                  cornerRadius: { type: "number" },
                  direction: { type: "string", enum: ["HORIZONTAL", "VERTICAL"] },
                  gap: { type: "number" },
                  padding: { type: "number" },
                  children: {
                    type: "array",
                    description: "Child elements. Can include CREATE_INSTANCE to nest other components. Name children for override targeting.",
                    items: {
                      type: "object",
                      properties: {
                        type: { type: "string", description: "CREATE_FRAME, CREATE_TEXT, CREATE_RECTANGLE, CREATE_INSTANCE, etc." },
                        componentId: { type: "string", description: "For CREATE_INSTANCE: ID of component to instantiate" },
                        name: { type: "string", description: "Layer name (important for override targeting)" },
                        overrides: { type: "object", description: "For CREATE_INSTANCE: override child properties" }
                      }
                    }
                  }
                },
                required: ["id", "name"]
              }
            }
          },
          required: ["components"]
        }
      },
      {
        name: "figma_create_screen",
        description: "Create a screen/frame that uses component instances. Perfect for building screens that reuse design system components. Instances reference components by their registered ID and can override text/fill properties.",
        inputSchema: {
          type: "object" as const,
          properties: {
            name: { type: "string", description: "Screen/frame name" },
            x: { type: "number" },
            y: { type: "number" },
            width: { type: "number", description: "Screen width (e.g. 390 for iPhone)" },
            height: { type: "number", description: "Screen height (e.g. 844 for iPhone)" },
            fill: { type: "string", description: "Background color" },
            direction: { type: "string", enum: ["HORIZONTAL", "VERTICAL"] },
            gap: { type: "number" },
            padding: { type: "number" },
            children: {
              type: "array",
              description: "Mix of component instances and raw elements",
              items: {
                type: "object",
                properties: {
                  type: { type: "string", description: "CREATE_INSTANCE to use a component, or CREATE_FRAME/CREATE_TEXT etc for raw elements" },
                  componentId: { type: "string", description: "For instances: the component ID to instantiate" },
                  overrides: {
                    type: "object",
                    description: "For instances: override child properties by name, e.g. { 'Label': { text: 'New Text' }, 'Icon': { fill: '#FF0000' } }"
                  },
                  name: { type: "string" },
                  fill: { type: "string" },
                  children: { type: "array", items: { type: "object" } }
                }
              }
            }
          },
          required: ["name", "width", "height"]
        }
      },
      {
        name: "figma_move_node",
        description: "Move a node to a new position",
        inputSchema: {
          type: "object" as const,
          properties: {
            id: { type: "string", description: "Registry ID of the node" },
            nodeId: { type: "string", description: "Figma node ID (e.g. '7:73')" },
            name: { type: "string", description: "Node name to find" },
            x: { type: "number", description: "New X position" },
            y: { type: "number", description: "New Y position" }
          }
        }
      },
      {
        name: "figma_update_node",
        description: "Update properties of an existing node",
        inputSchema: {
          type: "object" as const,
          properties: {
            id: { type: "string", description: "Registry ID of the node" },
            nodeId: { type: "string", description: "Figma node ID (e.g. '7:73')" },
            name: { type: "string", description: "Node name to find" },
            x: { type: "number" },
            y: { type: "number" },
            width: { type: "number" },
            height: { type: "number" },
            newName: { type: "string", description: "Rename the node" },
            fills: { type: "array", description: "New fills array" },
            cornerRadius: { type: "number" },
            visible: { type: "boolean" },
            opacity: { type: "number" },
            strokes: {
              type: "array",
              description: "Stroke colors array",
              items: {
                type: "object",
                properties: {
                  color: { type: "string" },
                  opacity: { type: "number" }
                }
              }
            },
            strokeWeight: { type: "number", description: "Stroke width" },
            strokeAlign: { type: "string", enum: ["INSIDE", "OUTSIDE", "CENTER"], description: "Stroke alignment" },
            dashPattern: {
              type: "array",
              items: { type: "number" },
              description: "Dash pattern array, e.g. [4, 4] for dashed lines"
            }
          }
        }
      },
      {
        name: "figma_delete_node",
        description: "Delete a node",
        inputSchema: {
          type: "object" as const,
          properties: {
            id: { type: "string", description: "Registry ID of the node" },
            nodeId: { type: "string", description: "Figma node ID (e.g. '7:73')" },
            name: { type: "string", description: "Node name to find" }
          }
        }
      },
      {
        name: "figma_get_node_by_name",
        description: "Find a node by name and register it for later use",
        inputSchema: {
          type: "object" as const,
          properties: {
            name: { type: "string", description: "Name of the node to find" },
            id: { type: "string", description: "ID to register this node as" }
          },
          required: ["name"]
        }
      },
      {
        name: "figma_get_selection",
        description: "Get the currently selected nodes in Figma. Returns detailed info about selected elements including their properties, fills, strokes, and children.",
        inputSchema: {
          type: "object" as const,
          properties: {
            depth: { type: "number", description: "How deep to traverse children (default: 3)" },
            register: { type: "boolean", description: "Register selected nodes for later reference" }
          }
        }
      },
      {
        name: "figma_get_page_nodes",
        description: "Get all top-level nodes on the current page. Useful for understanding the page structure.",
        inputSchema: {
          type: "object" as const,
          properties: {
            depth: { type: "number", description: "How deep to traverse children (default: 1)" },
            filter: { type: "string", description: "Filter by node type (FRAME, COMPONENT, TEXT, etc)" }
          }
        }
      },
      {
        name: "figma_get_node_by_id",
        description: "Fetch a specific node by its Figma ID (e.g. '7:73'). Returns detailed properties.",
        inputSchema: {
          type: "object" as const,
          properties: {
            nodeId: { type: "string", description: "Figma node ID" },
            depth: { type: "number", description: "How deep to traverse children (default: 3)" },
            id: { type: "string", description: "Registry ID to store this node for later use" }
          },
          required: ["nodeId"]
        }
      },
      {
        name: "figma_find_nodes",
        description: "Search for nodes by name pattern or type. Useful for finding specific elements.",
        inputSchema: {
          type: "object" as const,
          properties: {
            name: { type: "string", description: "Name to search for (partial match, case-insensitive)" },
            type: { type: "string", description: "Filter by node type (FRAME, COMPONENT, TEXT, RECTANGLE, etc)" },
            maxResults: { type: "number", description: "Maximum results to return (default: 50)" },
            depth: { type: "number", description: "Detail depth for each result (default: 1)" },
            register: { type: "boolean", description: "Register found nodes for later reference" }
          }
        }
      },
      {
        name: "figma_get_styles",
        description: "Get all local styles (colors, text styles, effects) from the document.",
        inputSchema: {
          type: "object" as const,
          properties: {
            type: { type: "string", enum: ["PAINT", "TEXT", "EFFECT", "ALL"], description: "Type of styles to fetch (default: ALL)" }
          }
        }
      },
      {
        name: "figma_get_components",
        description: "Get all local components in the document. Useful for understanding available design system components.",
        inputSchema: {
          type: "object" as const,
          properties: {
            depth: { type: "number", description: "How deep to traverse component children (default: 2)" }
          }
        }
      },
      {
        name: "figma_get_variables",
        description: "Get all local variables and variable collections (design tokens).",
        inputSchema: {
          type: "object" as const,
          properties: {}
        }
      },
      {
        name: "figma_export_node",
        description: "Export a node as PNG, SVG, or JSON. Returns base64-encoded data for images.",
        inputSchema: {
          type: "object" as const,
          properties: {
            nodeId: { type: "string", description: "Figma node ID to export" },
            name: { type: "string", description: "Node name to find and export" },
            id: { type: "string", description: "Registry ID of node to export" },
            format: { type: "string", enum: ["PNG", "SVG", "JPG", "PDF", "JSON"], description: "Export format (default: PNG)" },
            scale: { type: "number", description: "Scale multiplier for image export (default: 1)" }
          }
        }
      },
      // ========== NEW SHAPE TOOLS ==========
      {
        name: "figma_create_polygon",
        description: "Create a polygon shape in Figma",
        inputSchema: {
          type: "object" as const,
          properties: {
            id: { type: "string", description: "Unique ID to reference this polygon" },
            name: { type: "string", description: "Name of the polygon" },
            x: { type: "number" },
            y: { type: "number" },
            width: { type: "number", description: "Width in pixels" },
            height: { type: "number", description: "Height in pixels" },
            pointCount: { type: "number", description: "Number of sides (3 for triangle, 5 for pentagon, etc)" },
            fillColor: { type: "string", description: "Fill color as hex" },
            strokeColor: { type: "string", description: "Stroke color as hex" },
            strokeWeight: { type: "number" },
            cornerRadius: { type: "number" },
            parent: { type: "string", description: "Parent frame ID" }
          },
          required: ["pointCount"]
        }
      },
      {
        name: "figma_create_star",
        description: "Create a star shape in Figma",
        inputSchema: {
          type: "object" as const,
          properties: {
            id: { type: "string", description: "Unique ID to reference this star" },
            name: { type: "string", description: "Name of the star" },
            x: { type: "number" },
            y: { type: "number" },
            width: { type: "number" },
            height: { type: "number" },
            pointCount: { type: "number", description: "Number of points on the star (default: 5)" },
            innerRadius: { type: "number", description: "Inner radius ratio 0-1 (default: 0.5, smaller = pointier)" },
            fillColor: { type: "string", description: "Fill color as hex" },
            strokeColor: { type: "string", description: "Stroke color as hex" },
            strokeWeight: { type: "number" },
            parent: { type: "string" }
          },
          required: ["pointCount"]
        }
      },
      {
        name: "figma_create_vector",
        description: "Create a vector shape from SVG path data",
        inputSchema: {
          type: "object" as const,
          properties: {
            id: { type: "string" },
            name: { type: "string" },
            x: { type: "number" },
            y: { type: "number" },
            vectorPaths: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  windingRule: { type: "string", enum: ["NONZERO", "EVENODD"] },
                  data: { type: "string", description: "SVG path data string (M, L, C, etc)" }
                }
              },
              description: "Array of vector paths with SVG path data"
            },
            fillColor: { type: "string" },
            strokeColor: { type: "string" },
            strokeWeight: { type: "number" },
            strokeCap: { type: "string", enum: ["NONE", "ROUND", "SQUARE", "LINE_ARROW", "TRIANGLE_ARROW"] },
            strokeJoin: { type: "string", enum: ["MITER", "BEVEL", "ROUND"] },
            parent: { type: "string" }
          },
          required: ["vectorPaths"]
        }
      },
      {
        name: "figma_create_from_svg",
        description: "Create a node from SVG string content",
        inputSchema: {
          type: "object" as const,
          properties: {
            id: { type: "string" },
            name: { type: "string" },
            svg: { type: "string", description: "Complete SVG string content" },
            x: { type: "number" },
            y: { type: "number" },
            parent: { type: "string" }
          },
          required: ["svg"]
        }
      },
      {
        name: "figma_create_section",
        description: "Create a section (organizational container) in Figma",
        inputSchema: {
          type: "object" as const,
          properties: {
            id: { type: "string" },
            name: { type: "string", description: "Section name" },
            x: { type: "number" },
            y: { type: "number" },
            width: { type: "number" },
            height: { type: "number" },
            fillColor: { type: "string", description: "Background color" }
          },
          required: ["name"]
        }
      },
      {
        name: "figma_create_slice",
        description: "Create a slice for export regions",
        inputSchema: {
          type: "object" as const,
          properties: {
            id: { type: "string" },
            name: { type: "string" },
            x: { type: "number" },
            y: { type: "number" },
            width: { type: "number" },
            height: { type: "number" },
            exportSettings: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  format: { type: "string", enum: ["PNG", "JPG", "SVG", "PDF"] },
                  suffix: { type: "string" },
                  constraint: { type: "object" }
                }
              }
            }
          },
          required: ["width", "height"]
        }
      },
      // ========== BOOLEAN OPERATIONS ==========
      {
        name: "figma_boolean_union",
        description: "Combine multiple shapes into one (union/add)",
        inputSchema: {
          type: "object" as const,
          properties: {
            id: { type: "string", description: "ID for the resulting shape" },
            name: { type: "string" },
            nodeIds: {
              type: "array",
              items: { type: "string" },
              description: "Array of node IDs or registry IDs to combine"
            }
          },
          required: ["nodeIds"]
        }
      },
      {
        name: "figma_boolean_subtract",
        description: "Subtract shapes from the first shape",
        inputSchema: {
          type: "object" as const,
          properties: {
            id: { type: "string" },
            name: { type: "string" },
            nodeIds: {
              type: "array",
              items: { type: "string" },
              description: "Array of node IDs - first shape minus others"
            }
          },
          required: ["nodeIds"]
        }
      },
      {
        name: "figma_boolean_intersect",
        description: "Keep only overlapping areas of shapes",
        inputSchema: {
          type: "object" as const,
          properties: {
            id: { type: "string" },
            name: { type: "string" },
            nodeIds: {
              type: "array",
              items: { type: "string" }
            }
          },
          required: ["nodeIds"]
        }
      },
      {
        name: "figma_boolean_exclude",
        description: "Keep only non-overlapping areas of shapes",
        inputSchema: {
          type: "object" as const,
          properties: {
            id: { type: "string" },
            name: { type: "string" },
            nodeIds: {
              type: "array",
              items: { type: "string" }
            }
          },
          required: ["nodeIds"]
        }
      },
      {
        name: "figma_flatten_node",
        description: "Flatten a node to a single vector path",
        inputSchema: {
          type: "object" as const,
          properties: {
            id: { type: "string" },
            nodeId: { type: "string", description: "Figma node ID to flatten" },
            name: { type: "string", description: "Node name to find" }
          }
        }
      },
      // ========== GROUPING ==========
      {
        name: "figma_group_nodes",
        description: "Group multiple nodes together",
        inputSchema: {
          type: "object" as const,
          properties: {
            id: { type: "string" },
            name: { type: "string", description: "Group name" },
            nodeIds: {
              type: "array",
              items: { type: "string" },
              description: "Array of node IDs to group"
            }
          },
          required: ["nodeIds"]
        }
      },
      {
        name: "figma_ungroup_node",
        description: "Ungroup a group node",
        inputSchema: {
          type: "object" as const,
          properties: {
            nodeId: { type: "string", description: "Figma node ID of the group" },
            id: { type: "string", description: "Registry ID of the group" },
            name: { type: "string", description: "Group name to find" }
          }
        }
      },
      // ========== CONSTRAINTS & LAYOUT ==========
      {
        name: "figma_set_constraints",
        description: "Set resize constraints on a node",
        inputSchema: {
          type: "object" as const,
          properties: {
            nodeId: { type: "string" },
            id: { type: "string" },
            name: { type: "string" },
            horizontal: { type: "string", enum: ["MIN", "CENTER", "MAX", "STRETCH", "SCALE"], description: "Horizontal constraint" },
            vertical: { type: "string", enum: ["MIN", "CENTER", "MAX", "STRETCH", "SCALE"], description: "Vertical constraint" }
          },
          required: ["horizontal", "vertical"]
        }
      },
      {
        name: "figma_set_layout_grids",
        description: "Set layout grids on a frame",
        inputSchema: {
          type: "object" as const,
          properties: {
            nodeId: { type: "string" },
            id: { type: "string" },
            name: { type: "string" },
            layoutGrids: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  pattern: { type: "string", enum: ["COLUMNS", "ROWS", "GRID"] },
                  sectionSize: { type: "number" },
                  visible: { type: "boolean" },
                  color: { type: "string" },
                  alignment: { type: "string", enum: ["MIN", "CENTER", "MAX", "STRETCH"] },
                  gutterSize: { type: "number" },
                  count: { type: "number" },
                  offset: { type: "number" }
                }
              }
            }
          },
          required: ["layoutGrids"]
        }
      },
      // ========== EFFECTS ==========
      {
        name: "figma_set_effects",
        description: "Set effects (shadows, blurs) on a node",
        inputSchema: {
          type: "object" as const,
          properties: {
            nodeId: { type: "string" },
            id: { type: "string" },
            name: { type: "string" },
            effects: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  type: { type: "string", enum: ["DROP_SHADOW", "INNER_SHADOW", "LAYER_BLUR", "BACKGROUND_BLUR"] },
                  color: { type: "string", description: "Shadow color as hex (for shadows)" },
                  opacity: { type: "number", description: "Effect opacity 0-1" },
                  offset: { type: "object", properties: { x: { type: "number" }, y: { type: "number" } } },
                  radius: { type: "number", description: "Blur radius" },
                  spread: { type: "number", description: "Shadow spread" },
                  visible: { type: "boolean" },
                  showShadowBehindNode: { type: "boolean" }
                }
              },
              description: "Array of effects to apply"
            }
          },
          required: ["effects"]
        }
      },
      {
        name: "figma_set_blend_mode",
        description: "Set blend mode on a node",
        inputSchema: {
          type: "object" as const,
          properties: {
            nodeId: { type: "string" },
            id: { type: "string" },
            name: { type: "string" },
            blendMode: {
              type: "string",
              enum: ["PASS_THROUGH", "NORMAL", "DARKEN", "MULTIPLY", "LINEAR_BURN", "COLOR_BURN", "LIGHTEN", "SCREEN", "LINEAR_DODGE", "COLOR_DODGE", "OVERLAY", "SOFT_LIGHT", "HARD_LIGHT", "DIFFERENCE", "EXCLUSION", "HUE", "SATURATION", "COLOR", "LUMINOSITY"],
              description: "Blend mode to apply"
            }
          },
          required: ["blendMode"]
        }
      },
      // ========== VIEWPORT & SELECTION ==========
      {
        name: "figma_set_selection",
        description: "Set the current selection in Figma",
        inputSchema: {
          type: "object" as const,
          properties: {
            nodeIds: {
              type: "array",
              items: { type: "string" },
              description: "Array of node IDs to select"
            }
          },
          required: ["nodeIds"]
        }
      },
      {
        name: "figma_zoom_to_fit",
        description: "Zoom viewport to fit specified nodes or selection",
        inputSchema: {
          type: "object" as const,
          properties: {
            nodeIds: {
              type: "array",
              items: { type: "string" },
              description: "Node IDs to fit in view (uses selection if not specified)"
            }
          }
        }
      },
      {
        name: "figma_get_viewport",
        description: "Get current viewport position and zoom",
        inputSchema: {
          type: "object" as const,
          properties: {}
        }
      },
      {
        name: "figma_set_viewport",
        description: "Set viewport position and zoom",
        inputSchema: {
          type: "object" as const,
          properties: {
            x: { type: "number", description: "X position" },
            y: { type: "number", description: "Y position" },
            zoom: { type: "number", description: "Zoom level (1 = 100%)" }
          }
        }
      },
      // ========== ADVANCED FILLS ==========
      {
        name: "figma_set_gradient_fill",
        description: "Set a gradient fill on a node",
        inputSchema: {
          type: "object" as const,
          properties: {
            nodeId: { type: "string" },
            id: { type: "string" },
            name: { type: "string" },
            gradientType: { type: "string", enum: ["LINEAR", "RADIAL", "ANGULAR", "DIAMOND"], description: "Type of gradient" },
            stops: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  position: { type: "number", description: "Position 0-1" },
                  color: { type: "string", description: "Color as hex" },
                  opacity: { type: "number" }
                }
              },
              description: "Color stops for the gradient"
            },
            angle: { type: "number", description: "Rotation angle in degrees (for linear)" }
          },
          required: ["gradientType", "stops"]
        }
      }
    ]
  };
});

// Process data for shorthand conversions (convenience transforms)
function processData(data: Record<string, unknown>): Record<string, unknown> {
  const result = { ...data };

  // fillColor -> fills
  if (result.fillColor) {
    result.fills = [{ color: result.fillColor }];
    delete result.fillColor;
  }
  // fill -> fills (additional shorthand)
  if (result.fill && !result.fills) {
    result.fills = [{ color: result.fill }];
  }
  // Handle stroke shorthand - string to object
  if (typeof result.stroke === 'string') {
    result.stroke = {
      color: result.stroke,
      weight: (result.strokeWeight as number) || 1,
      align: result.strokeAlign,
      dashPattern: result.dashPattern
    };
    delete result.strokeWeight;
    delete result.strokeAlign;
    delete result.dashPattern;
  }
  // Handle strokeColor shorthand
  if (result.strokeColor) {
    result.stroke = {
      color: result.strokeColor,
      weight: (result.strokeWeight as number) || 1,
      align: result.strokeAlign,
      dashPattern: result.dashPattern
    };
    delete result.strokeColor;
    delete result.strokeWeight;
    delete result.strokeAlign;
    delete result.dashPattern;
  }
  return result;
}

// Process a command with nested children (for tree structures)
function processCommand(cmd: Command): Command {
  const processed = {
    type: cmd.type,
    id: cmd.id,
    data: cmd.data ? processData(cmd.data as Record<string, unknown>) : undefined,
    children: cmd.children ? cmd.children.map(processCommand) : undefined
  } as Command;

  return processed;
}

// Find dependencies in a component tree (looks for componentId in data)
function findDependencies(cmd: Command, deps: Set<string> = new Set()): Set<string> {
  if (cmd.type === 'CREATE_INSTANCE' && cmd.data?.componentId) {
    deps.add(cmd.data.componentId as string);
  }
  if (cmd.children && Array.isArray(cmd.children)) {
    cmd.children.forEach((child: Command) => findDependencies(child, deps));
  }
  return deps;
}

// Topological sort for dependency order
function sortByDependencies(components: Command[]): Command[] {
  const componentMap = new Map(components.map(c => [c.id!, c]));
  const sorted: Command[] = [];
  const visited = new Set<string>();
  const visiting = new Set<string>();

  function visit(comp: Command) {
    if (!comp.id) return;
    if (visited.has(comp.id)) return;
    if (visiting.has(comp.id)) {
      console.error(`Circular dependency detected involving: ${comp.id}`);
      return;
    }

    visiting.add(comp.id);
    const deps = findDependencies(comp);

    for (const depId of deps) {
      const dep = componentMap.get(depId);
      if (dep) {
        visit(dep);
      }
    }

    visiting.delete(comp.id);
    visited.add(comp.id);
    sorted.push(comp);
  }

  components.forEach(comp => visit(comp));
  return sorted;
}

// Handle tool calls
server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;

  try {
    if (name === "figma_status") {
      return {
        content: [{
          type: "text",
          text: JSON.stringify({
            connected: figmaClient !== null,
            pendingCommands: pendingCommands.length
          }, null, 2)
        }]
      };
    }

    if (name === "figma_batch_commands") {
      const typedArgs = args as { commands: Command[] };
      const results = await sendToFigma(typedArgs.commands);
      return {
        content: [{
          type: "text",
          text: `Executed ${typedArgs.commands.length} commands. Results: ${JSON.stringify(results, null, 2)}`
        }]
      };
    }

    if (name === "figma_create_tree") {
      const typedArgs = args as { tree: Command };
      const processedTree = processCommand(typedArgs.tree);
      const results = await sendToFigma([processedTree]);
      const result = results[0];

      if (result && result.success) {
        const treeData = typedArgs.tree.data as Record<string, unknown> | undefined;
        return {
          content: [{
            type: "text",
            text: `✔ Created component tree "${treeData?.name || typedArgs.tree.type}" (root node: ${result.nodeId})`
          }]
        };
      } else {
        throw new Error(result?.error || "Unknown error");
      }
    }

    if (name === "figma_define_components") {
      // Components are Command[] with type and data
      const typedArgs = args as { components: Command[] };

      // Sort components by dependencies (look in data for componentId references)
      const sortedComponents = sortByDependencies(typedArgs.components);

      // Convert each component definition to CREATE_COMPONENT command
      const commands = sortedComponents.map((comp, index) => {
        const compData = (comp.data || {}) as Record<string, unknown>;
        const data = processData(compData);
        return {
          type: "CREATE_COMPONENT",
          id: comp.id,
          data: {
            ...data,
            x: data.x ?? (index * 400),
            y: data.y ?? 0
          },
          children: comp.children
        } as Command;
      });

      const results = await sendToFigma(commands.map(processCommand));
      const successful = results.filter(r => r.success).length;
      const componentIds = results.map((r, i) => `${sortedComponents[i].id}: ${r.nodeId}`).join(', ');

      return {
        content: [{
          type: "text",
          text: `✔ Defined ${successful}/${typedArgs.components.length} components (dependency-ordered). IDs: ${componentIds}`
        }]
      };
    }

    if (name === "figma_create_screen") {
      const typedArgs = args as {
        name: string;
        x?: number;
        y?: number;
        width: number;
        height: number;
        fill?: string;
        direction?: string;
        gap?: number;
        padding?: number;
        paddingTop?: number;
        paddingRight?: number;
        paddingBottom?: number;
        paddingLeft?: number;
        children?: Command[];
      };

      // Build the screen as a frame with children
      const screen: Command = {
        type: "CREATE_FRAME",
        data: {
          name: typedArgs.name,
          x: typedArgs.x ?? 0,
          y: typedArgs.y ?? 0,
          width: typedArgs.width,
          height: typedArgs.height,
          fills: typedArgs.fill ? [{ color: typedArgs.fill }] : undefined,
          direction: typedArgs.direction as 'HORIZONTAL' | 'VERTICAL' | undefined,
          gap: typedArgs.gap,
          padding: typedArgs.padding,
          paddingTop: typedArgs.paddingTop,
          paddingRight: typedArgs.paddingRight,
          paddingBottom: typedArgs.paddingBottom,
          paddingLeft: typedArgs.paddingLeft,
          clipsContent: true
        },
        children: typedArgs.children
      };

      const results = await sendToFigma([processCommand(screen)]);
      const result = results[0];

      if (result && result.success) {
        return {
          content: [{
            type: "text",
            text: `✔ Created screen "${typedArgs.name}" (${typedArgs.width}x${typedArgs.height}) with ${typedArgs.children?.length || 0} children (node: ${result.nodeId})`
          }]
        };
      } else {
        throw new Error(result?.error || "Unknown error");
      }
    }

    // Map tool names to command types
    const toolToCommand: Record<string, string> = {
      // Creation
      "figma_create_frame": "CREATE_FRAME",
      "figma_create_rectangle": "CREATE_RECTANGLE",
      "figma_create_ellipse": "CREATE_ELLIPSE",
      "figma_create_polygon": "CREATE_POLYGON",
      "figma_create_star": "CREATE_STAR",
      "figma_create_line": "CREATE_LINE",
      "figma_create_vector": "CREATE_VECTOR",
      "figma_create_from_svg": "CREATE_FROM_SVG",
      "figma_create_text": "CREATE_TEXT",
      "figma_create_component": "CREATE_COMPONENT",
      "figma_create_instance": "CREATE_INSTANCE",
      "figma_create_section": "CREATE_SECTION",
      "figma_create_slice": "CREATE_SLICE",
      // Styles & Variables
      "figma_create_variable_collection": "CREATE_VARIABLE_COLLECTION",
      "figma_create_variable": "CREATE_VARIABLE",
      "figma_create_text_style": "CREATE_STYLE",
      "figma_create_color_style": "CREATE_STYLE",
      // Boolean operations
      "figma_boolean_union": "BOOLEAN_UNION",
      "figma_boolean_subtract": "BOOLEAN_SUBTRACT",
      "figma_boolean_intersect": "BOOLEAN_INTERSECT",
      "figma_boolean_exclude": "BOOLEAN_EXCLUDE",
      "figma_flatten_node": "FLATTEN_NODE",
      // Grouping
      "figma_group_nodes": "GROUP_NODES",
      "figma_ungroup_node": "UNGROUP_NODE",
      // Modification
      "figma_move_node": "MOVE_NODE",
      "figma_update_node": "UPDATE_NODE",
      "figma_delete_node": "DELETE_NODE",
      "figma_set_constraints": "SET_CONSTRAINTS",
      "figma_set_layout_grids": "SET_LAYOUT_GRIDS",
      "figma_set_effects": "SET_EFFECTS",
      "figma_set_blend_mode": "SET_BLEND_MODE",
      "figma_set_gradient_fill": "SET_GRADIENT_FILL",
      // Viewport & Selection
      "figma_set_selection": "SET_SELECTION",
      "figma_zoom_to_fit": "ZOOM_TO_FIT",
      "figma_get_viewport": "GET_VIEWPORT",
      "figma_set_viewport": "SET_VIEWPORT",
      // Queries
      "figma_get_node_by_name": "GET_NODE_BY_NAME",
      "figma_get_selection": "GET_SELECTION",
      "figma_get_page_nodes": "GET_PAGE_NODES",
      "figma_get_node_by_id": "GET_NODE_BY_ID",
      "figma_find_nodes": "FIND_NODES",
      "figma_get_styles": "GET_STYLES",
      "figma_get_components": "GET_COMPONENTS",
      "figma_get_variables": "GET_VARIABLES",
      // Export
      "figma_export_node": "EXPORT_NODE"
    };

    const commandType = toolToCommand[name];
    if (!commandType) {
      throw new Error(`Unknown tool: ${name}`);
    }

    // Extract id and children if present, rest goes to data
    const { id, children, ...rest } = args as Record<string, unknown>;

    // Process the data for convenience transforms
    const data = processData(rest);

    // Handle special cases - add to data
    if (name === "figma_create_text_style") {
      data.styleType = "TEXT";
    } else if (name === "figma_create_color_style") {
      data.styleType = "PAINT";
    }

    // Build command with new structure (cast type since we validate it exists in toolToCommand)
    const command = {
      type: commandType as CommandType,
      id: id as string | undefined,
      data,
      children: children as Command[] | undefined
    } as Command;

    const results = await sendToFigma([processCommand(command)]);
    const result = results[0];

    // Fetch commands return data directly
    const fetchCommands = ["GET_SELECTION", "GET_PAGE_NODES", "GET_NODE_BY_ID", "FIND_NODES", "GET_STYLES", "GET_COMPONENTS", "GET_VARIABLES", "EXPORT_NODE", "GET_VIEWPORT"];

    if (fetchCommands.includes(commandType)) {
      if (result && result.success) {
        const { success, _cmdId, ...data } = result;
        return {
          content: [{
            type: "text",
            text: JSON.stringify(data, null, 2)
          }]
        };
      } else {
        throw new Error(result?.error || "Unknown error");
      }
    }

    if (result && result.success) {
      return {
        content: [{
          type: "text",
          text: `Done: ${(data.name as string) || commandType} (node: ${result.nodeId})`
        }]
      };
    } else {
      throw new Error(result?.error || "Unknown error");
    }

  } catch (error) {
    return {
      content: [{
        type: "text",
        text: `Error: ${(error as Error).message}`
      }],
      isError: true
    };
  }
});

// Start MCP server
async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error("[Figma MCP Bridge] MCP server started");
}

main().catch(console.error);
