/**
 * Main tool handler dispatcher.
 * Routes MCP tool calls to the appropriate handler and executes commands.
 */

import type { Command } from "../../../types/commands.js";
import type { CommandQueue } from "../../queue.js";
import type { ToolCallResult } from "./types.js";
import {
  formatCreationResult,
  formatQueryResult,
  formatError,
} from "./types.js";
import { processCommand } from "../utils.js";
import { toolSchemaByName, fetchCommandTypes } from "../generated-schemas.js";

// ============ Import all handlers ============

import * as figma_create_frame from "./figma_create_frame.js";
import * as figma_create_rectangle from "./figma_create_rectangle.js";
import * as figma_create_ellipse from "./figma_create_ellipse.js";
import * as figma_create_polygon from "./figma_create_polygon.js";
import * as figma_create_star from "./figma_create_star.js";
import * as figma_create_line from "./figma_create_line.js";
import * as figma_create_vector from "./figma_create_vector.js";
import * as figma_create_section from "./figma_create_section.js";
import * as figma_create_slice from "./figma_create_slice.js";
import * as figma_create_from_svg from "./figma_create_from_svg.js";
import * as figma_create_text from "./figma_create_text.js";
import * as figma_create_component from "./figma_create_component.js";
import * as figma_create_instance from "./figma_create_instance.js";
import * as figma_group_nodes from "./figma_group_nodes.js";
import * as figma_ungroup_node from "./figma_ungroup_node.js";
import * as figma_boolean_union from "./figma_boolean_union.js";
import * as figma_boolean_subtract from "./figma_boolean_subtract.js";
import * as figma_boolean_intersect from "./figma_boolean_intersect.js";
import * as figma_boolean_exclude from "./figma_boolean_exclude.js";
import * as figma_flatten_node from "./figma_flatten_node.js";
import * as figma_move_node from "./figma_move_node.js";
import * as figma_update_node from "./figma_update_node.js";
import * as figma_delete_node from "./figma_delete_node.js";
import * as figma_set_constraints from "./figma_set_constraints.js";
import * as figma_set_layout_grids from "./figma_set_layout_grids.js";
import * as figma_set_effects from "./figma_set_effects.js";
import * as figma_set_blend_mode from "./figma_set_blend_mode.js";
import * as figma_set_gradient_fill from "./figma_set_gradient_fill.js";
import * as figma_get_node_by_name from "./figma_get_node_by_name.js";
import * as figma_get_selection from "./figma_get_selection.js";
import * as figma_get_page_nodes from "./figma_get_page_nodes.js";
import * as figma_get_node_by_id from "./figma_get_node_by_id.js";
import * as figma_find_nodes from "./figma_find_nodes.js";
import * as figma_get_styles from "./figma_get_styles.js";
import * as figma_get_components from "./figma_get_components.js";
import * as figma_get_variables from "./figma_get_variables.js";
import * as figma_export_node from "./figma_export_node.js";
import * as figma_create_text_style from "./figma_create_text_style.js";
import * as figma_create_color_style from "./figma_create_color_style.js";
import * as figma_create_effect_style from "./figma_create_effect_style.js";
import * as figma_create_variable_collection from "./figma_create_variable_collection.js";
import * as figma_create_variable from "./figma_create_variable.js";
import * as figma_set_selection from "./figma_set_selection.js";
import * as figma_zoom_to_fit from "./figma_zoom_to_fit.js";
import * as figma_get_viewport from "./figma_get_viewport.js";
import * as figma_set_viewport from "./figma_set_viewport.js";
import * as figma_create_page from "./figma_create_page.js";
import * as figma_create_page_divider from "./figma_create_page_divider.js";
import * as figma_import_component from "./figma_import_component.js";
import * as figma_component_from_node from "./figma_component_from_node.js";
import * as figma_set_fills from "./figma_set_fills.js";
import * as figma_set_strokes from "./figma_set_strokes.js";
import * as figma_set_layout from "./figma_set_layout.js";
import * as figma_set_mask from "./figma_set_mask.js";
import * as figma_set_transform from "./figma_set_transform.js";
import * as figma_set_image_fill from "./figma_set_image_fill.js";
import * as figma_create_image from "./figma_create_image.js";
import * as figma_get_image_data from "./figma_get_image_data.js";
import * as figma_set_text_range_style from "./figma_set_text_range_style.js";
import * as figma_clone_node from "./figma_clone_node.js";
import * as figma_list_fonts from "./figma_list_fonts.js";

// ============ Build handler map ============

type ToolHandler = (args: Record<string, unknown>) => Command;

const handlerModules = [
  figma_create_frame,
  figma_create_rectangle,
  figma_create_ellipse,
  figma_create_polygon,
  figma_create_star,
  figma_create_line,
  figma_create_vector,
  figma_create_section,
  figma_create_slice,
  figma_create_from_svg,
  figma_create_text,
  figma_create_component,
  figma_create_instance,
  figma_group_nodes,
  figma_ungroup_node,
  figma_boolean_union,
  figma_boolean_subtract,
  figma_boolean_intersect,
  figma_boolean_exclude,
  figma_flatten_node,
  figma_move_node,
  figma_update_node,
  figma_delete_node,
  figma_set_constraints,
  figma_set_layout_grids,
  figma_set_effects,
  figma_set_blend_mode,
  figma_set_gradient_fill,
  figma_get_node_by_name,
  figma_get_selection,
  figma_get_page_nodes,
  figma_get_node_by_id,
  figma_find_nodes,
  figma_get_styles,
  figma_get_components,
  figma_get_variables,
  figma_export_node,
  figma_create_text_style,
  figma_create_color_style,
  figma_create_effect_style,
  figma_create_variable_collection,
  figma_create_variable,
  figma_set_selection,
  figma_zoom_to_fit,
  figma_get_viewport,
  figma_set_viewport,
  figma_create_page,
  figma_create_page_divider,
  figma_import_component,
  figma_component_from_node,
  figma_set_fills,
  figma_set_strokes,
  figma_set_layout,
  figma_set_mask,
  figma_set_transform,
  figma_set_image_fill,
  figma_create_image,
  figma_get_image_data,
  figma_set_text_range_style,
  figma_clone_node,
  figma_list_fonts,
];

const toolHandlers: Map<string, ToolHandler> = new Map(
  handlerModules.map((m) => [m.toolName, m.handler])
);

// ============ Main Dispatcher ============

/**
 * Handle an MCP tool call by routing to the appropriate handler.
 */
export async function handleToolCall(
  name: string,
  args: Record<string, unknown> | undefined,
  queue: CommandQueue,
  getConnectionStatus: () => boolean,
  getMode: () => "primary" | "relay"
): Promise<ToolCallResult> {
  try {
    // ============ Special Cases (no command submission) ============

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
                mode: getMode(),
              },
              null,
              2
            ),
          },
        ],
      };
    }

    // ============ Standard Tool Handling ============

    // Look up the tool schema for this tool
    const toolSchema = toolSchemaByName.get(name);
    if (!toolSchema) {
      throw new Error(`Unknown tool: ${name}`);
    }

    // Get the handler for this tool
    const handler = toolHandlers.get(name);
    if (!handler) {
      throw new Error(`No handler for tool: ${name}`);
    }

    // Execute the handler to get the command
    const command = handler(args || {});

    // Process and submit the command
    const processedCommand = processCommand(command);
    const results = await queue.submitBatch([processedCommand]);
    const result = results[0];

    // Format the response based on command type
    if (fetchCommandTypes.has(toolSchema.commandType)) {
      if (result && result.success) {
        return formatQueryResult(result);
      } else {
        throw new Error(result?.error || "Unknown error");
      }
    }

    if (result && result.success) {
      const data = (command.data || {}) as Record<string, unknown>;
      return formatCreationResult(
        result,
        toolSchema.commandType,
        data.name as string | undefined
      );
    } else {
      throw new Error(result?.error || "Unknown error");
    }
  } catch (error) {
    return formatError(error as Error);
  }
}

// Re-export types
export type { ToolCallResult } from "./types.js";
