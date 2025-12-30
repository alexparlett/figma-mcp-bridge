import type { Command, CommandType, CommandResult } from "../../types/types.js";
import type { CommandQueue } from "../queue.js";
import { processData, processCommand, sortByDependencies } from "./utils.js";

const toolToCommand: Record<string, string> = {
  // Creation
  figma_create_frame: "CREATE_FRAME",
  figma_create_rectangle: "CREATE_RECTANGLE",
  figma_create_ellipse: "CREATE_ELLIPSE",
  figma_create_polygon: "CREATE_POLYGON",
  figma_create_star: "CREATE_STAR",
  figma_create_line: "CREATE_LINE",
  figma_create_vector: "CREATE_VECTOR",
  figma_create_from_svg: "CREATE_FROM_SVG",
  figma_create_text: "CREATE_TEXT",
  figma_create_component: "CREATE_COMPONENT",
  figma_create_instance: "CREATE_INSTANCE",
  figma_create_section: "CREATE_SECTION",
  figma_create_slice: "CREATE_SLICE",
  // Styles & Variables
  figma_create_variable_collection: "CREATE_VARIABLE_COLLECTION",
  figma_create_variable: "CREATE_VARIABLE",
  figma_create_text_style: "CREATE_STYLE",
  figma_create_color_style: "CREATE_STYLE",
  // Boolean operations
  figma_boolean_union: "BOOLEAN_UNION",
  figma_boolean_subtract: "BOOLEAN_SUBTRACT",
  figma_boolean_intersect: "BOOLEAN_INTERSECT",
  figma_boolean_exclude: "BOOLEAN_EXCLUDE",
  figma_flatten_node: "FLATTEN_NODE",
  // Grouping
  figma_group_nodes: "GROUP_NODES",
  figma_ungroup_node: "UNGROUP_NODE",
  // Modification
  figma_move_node: "MOVE_NODE",
  figma_update_node: "UPDATE_NODE",
  figma_delete_node: "DELETE_NODE",
  figma_set_constraints: "SET_CONSTRAINTS",
  figma_set_layout_grids: "SET_LAYOUT_GRIDS",
  figma_set_effects: "SET_EFFECTS",
  figma_set_blend_mode: "SET_BLEND_MODE",
  figma_set_gradient_fill: "SET_GRADIENT_FILL",
  // Viewport & Selection
  figma_set_selection: "SET_SELECTION",
  figma_zoom_to_fit: "ZOOM_TO_FIT",
  figma_get_viewport: "GET_VIEWPORT",
  figma_set_viewport: "SET_VIEWPORT",
  // Queries
  figma_get_node_by_name: "GET_NODE_BY_NAME",
  figma_get_selection: "GET_SELECTION",
  figma_get_page_nodes: "GET_PAGE_NODES",
  figma_get_node_by_id: "GET_NODE_BY_ID",
  figma_find_nodes: "FIND_NODES",
  figma_get_styles: "GET_STYLES",
  figma_get_components: "GET_COMPONENTS",
  figma_get_variables: "GET_VARIABLES",
  // Export
  figma_export_node: "EXPORT_NODE",
};

const fetchCommands = [
  "GET_SELECTION",
  "GET_PAGE_NODES",
  "GET_NODE_BY_ID",
  "FIND_NODES",
  "GET_STYLES",
  "GET_COMPONENTS",
  "GET_VARIABLES",
  "EXPORT_NODE",
  "GET_VIEWPORT",
];

export interface ToolCallResult {
  content: Array<{ type: "text"; text: string }>;
  isError?: boolean;
}

export async function handleToolCall(
  name: string,
  args: Record<string, unknown> | undefined,
  queue: CommandQueue,
  getConnectionStatus: () => boolean
): Promise<ToolCallResult> {
  try {
    if (name === "figma_status") {
      const status = queue.getStatus();
      return {
        content: [
          {
            type: "text",
            text: JSON.stringify(
              {
                connected: getConnectionStatus(),
                pendingCommands: status.pendingCount,
              },
              null,
              2
            ),
          },
        ],
      };
    }

    if (name === "figma_batch_commands") {
      const typedArgs = args as { commands: Command[] };
      const results = await queue.submitBatch(typedArgs.commands);
      return {
        content: [
          {
            type: "text",
            text: `Executed ${typedArgs.commands.length} commands. Results: ${JSON.stringify(results, null, 2)}`,
          },
        ],
      };
    }

    if (name === "figma_create_tree") {
      const typedArgs = args as { tree: Command };
      const processedTree = processCommand(typedArgs.tree);
      const results = await queue.submitBatch([processedTree]);
      const result = results[0];

      if (result && result.success) {
        const treeData = typedArgs.tree.data as Record<string, unknown> | undefined;
        return {
          content: [
            {
              type: "text",
              text: `Created component tree "${treeData?.name || typedArgs.tree.type}" (root node: ${result.nodeId})`,
            },
          ],
        };
      } else {
        throw new Error(result?.error || "Unknown error");
      }
    }

    if (name === "figma_define_components") {
      const typedArgs = args as { components: Command[] };
      const sortedComponents = sortByDependencies(typedArgs.components);

      const commands = sortedComponents.map((comp, index) => {
        const compData = (comp.data || {}) as Record<string, unknown>;
        const data = processData(compData);
        return {
          type: "CREATE_COMPONENT",
          id: comp.id,
          data: {
            ...data,
            x: data.x ?? index * 400,
            y: data.y ?? 0,
          },
          children: comp.children,
        } as Command;
      });

      const results = await queue.submitBatch(commands.map(processCommand));
      const successful = results.filter((r) => r.success).length;
      const componentIds = results.map((r, i) => `${sortedComponents[i].id}: ${r.nodeId}`).join(", ");

      return {
        content: [
          {
            type: "text",
            text: `Defined ${successful}/${typedArgs.components.length} components (dependency-ordered). IDs: ${componentIds}`,
          },
        ],
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

      const screen: Command = {
        type: "CREATE_FRAME",
        data: {
          name: typedArgs.name,
          x: typedArgs.x ?? 0,
          y: typedArgs.y ?? 0,
          width: typedArgs.width,
          height: typedArgs.height,
          fills: typedArgs.fill ? [{ color: typedArgs.fill }] : undefined,
          direction: typedArgs.direction as "HORIZONTAL" | "VERTICAL" | undefined,
          gap: typedArgs.gap,
          padding: typedArgs.padding,
          paddingTop: typedArgs.paddingTop,
          paddingRight: typedArgs.paddingRight,
          paddingBottom: typedArgs.paddingBottom,
          paddingLeft: typedArgs.paddingLeft,
          clipsContent: true,
        },
        children: typedArgs.children,
      };

      const results = await queue.submitBatch([processCommand(screen)]);
      const result = results[0];

      if (result && result.success) {
        return {
          content: [
            {
              type: "text",
              text: `Created screen "${typedArgs.name}" (${typedArgs.width}x${typedArgs.height}) with ${typedArgs.children?.length || 0} children (node: ${result.nodeId})`,
            },
          ],
        };
      } else {
        throw new Error(result?.error || "Unknown error");
      }
    }

    const commandType = toolToCommand[name];
    if (!commandType) {
      throw new Error(`Unknown tool: ${name}`);
    }

    const { id, children, ...rest } = (args || {}) as Record<string, unknown>;
    const data = processData(rest);

    if (name === "figma_create_text_style") {
      data.styleType = "TEXT";
    } else if (name === "figma_create_color_style") {
      data.styleType = "PAINT";
    }

    const command = {
      type: commandType as CommandType,
      id: id as string | undefined,
      data,
      children: children as Command[] | undefined,
    } as Command;

    const results = await queue.submitBatch([processCommand(command)]);
    const result = results[0];

    if (fetchCommands.includes(commandType)) {
      if (result && result.success) {
        const { success, _cmdId, ...responseData } = result;
        return {
          content: [
            {
              type: "text",
              text: JSON.stringify(responseData, null, 2),
            },
          ],
        };
      } else {
        throw new Error(result?.error || "Unknown error");
      }
    }

    if (result && result.success) {
      return {
        content: [
          {
            type: "text",
            text: `Done: ${(data.name as string) || commandType} (node: ${result.nodeId})`,
          },
        ],
      };
    } else {
      throw new Error(result?.error || "Unknown error");
    }
  } catch (error) {
    return {
      content: [
        {
          type: "text",
          text: `Error: ${(error as Error).message}`,
        },
      ],
      isError: true,
    };
  }
}
