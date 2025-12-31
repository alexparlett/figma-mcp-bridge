# Figma MCP Bridge

MCP server and Figma plugin enabling Claude to create and manipulate designs in Figma via the Model Context Protocol.

## Architecture

```
Claude → MCP Server (stdio) → WebSocket → Figma Plugin → Figma API
```

- **`server/`** - MCP server exposing 50+ Figma tools (TypeScript, ESM)
- **`plugin/`** - Figma plugin executing commands from the MCP server (TypeScript, bundled with esbuild)
- **`types/`** - Shared type definitions for commands, data payloads, and messages

## Build

```bash
npm install
npm run build          # Build both server and plugin
npm run build:server   # Build server only
npm run build:plugin   # Build plugin only (includes TypeScript check)
npm run watch          # Watch mode for development
npm run generate:schemas # Regenerate JSON schemas from TypeScript types
```

## Running

### MCP Server (Claude Desktop)

Add to Claude Desktop config (`~/Library/Application Support/Claude/claude_desktop_config.json`):

```json
{
  "mcpServers": {
    "figma-bridge": {
      "command": "node",
      "args": ["/path/to/figma-mcp-bridge/dist/server/index.js"]
    }
  }
}
```

### Figma Plugin

1. Open Figma Desktop
2. Plugins → Development → Import plugin from manifest
3. Select `dist/plugin/manifest.json`
4. Run the plugin - it connects via WebSocket to the MCP server on port 3456

## Key Files

### Server
- `server/index.ts` - Entry point, starts MCP and WebSocket servers
- `server/mcp-server.ts` - MCP protocol handling and tool registration
- `server/websocket-server.ts` - WebSocket server for plugin communication
- `server/tools/tool-metadata.ts` - Tool definitions with descriptions and required fields
- `server/tools/handlers/` - Individual handler for each tool (50+ files)
- `server/tools/generated-schemas.ts` - Auto-generated JSON schemas from TypeScript types

### Plugin
- `plugin/code.ts` - Plugin entry point and command router
- `plugin/handlers/` - Command handlers organized by domain:
  - `shapes.ts` - Frame, rectangle, ellipse, polygon, star, line, vector, section, slice
  - `text.ts` - Text creation and styling
  - `components.ts` - Component and instance creation
  - `boolean.ts` - Boolean operations (union, subtract, intersect, exclude)
  - `modifiers.ts` - Node updates, constraints, effects, fills, strokes
  - `queries.ts` - Selection, page nodes, find nodes, styles, components
  - `viewport.ts` - Viewport and selection control
  - `images.ts` - Image creation and fills
  - `styles.ts` - Text, color, and effect styles
  - `page.ts` - Page creation
  - `export.ts` - Node export
- `plugin/utils.ts` - Shared utilities (color parsing, paint creation, node serialization)
- `plugin/registry.ts` - Node registry for referencing created elements by ID

### Types
- `types/commands.ts` - CommandType enum and CommandDataMap for type-safe dispatch
- `types/data.ts` - Data payload types for all commands
- `types/messages.ts` - WebSocket message types

## Available Tools (50+)

### Creation
- Shapes: `figma_create_frame`, `figma_create_rectangle`, `figma_create_ellipse`, `figma_create_polygon`, `figma_create_star`, `figma_create_line`, `figma_create_vector`, `figma_create_from_svg`, `figma_create_section`, `figma_create_slice`
- Text: `figma_create_text`
- Components: `figma_create_component`, `figma_create_instance`, `figma_component_from_node`, `figma_import_component`
- Pages: `figma_create_page`, `figma_create_page_divider`

### Modification
- `figma_update_node`, `figma_move_node`, `figma_delete_node`, `figma_clone_node`
- `figma_set_fills`, `figma_set_strokes`, `figma_set_effects`, `figma_set_gradient_fill`
- `figma_set_layout`, `figma_set_constraints`, `figma_set_layout_grids`
- `figma_set_blend_mode`, `figma_set_mask`, `figma_set_transform`
- `figma_set_image_fill`, `figma_set_text_range_style`

### Boolean & Grouping
- `figma_boolean_union`, `figma_boolean_subtract`, `figma_boolean_intersect`, `figma_boolean_exclude`
- `figma_flatten_node`, `figma_group_nodes`, `figma_ungroup_node`

### Design Tokens & Styles
- `figma_create_text_style`, `figma_create_color_style`, `figma_create_effect_style`
- `figma_create_variable_collection`, `figma_create_variable`

### Queries
- `figma_get_selection`, `figma_get_page_nodes`, `figma_get_node_by_id`, `figma_get_node_by_name`, `figma_find_nodes`
- `figma_get_styles`, `figma_get_components`, `figma_get_variables`, `figma_list_fonts`

### Images
- `figma_create_image`, `figma_get_image_data`

### Viewport & Selection
- `figma_set_selection`, `figma_zoom_to_fit`, `figma_get_viewport`, `figma_set_viewport`

### Export & Status
- `figma_export_node` - Export as PNG, JPG, SVG, PDF, or JSON
- `figma_status` - Check plugin connection

## Adding New Tools

1. Add command type to `types/commands.ts` (CommandType enum and CommandDataMap)
2. Add data type to `types/data.ts`
3. Create server handler in `server/tools/handlers/figma_<tool_name>.ts`
4. Export handler from `server/tools/handlers/index.ts`
5. Add metadata to `server/tools/tool-metadata.ts`
6. Implement plugin handler in appropriate `plugin/handlers/*.ts` file
7. Add command to `plugin/handlers/index.ts` commandHandlers map
8. Run `npm run generate:schemas` to update JSON schemas
9. Rebuild with `npm run build`

## TypeScript Configuration

- `tsconfig.base.json` - Shared settings (strict mode, ES2022 lib)
- `tsconfig.server.json` - Server (ES2022 target, ESM modules, dist/server output)
- `tsconfig.plugin.json` - Plugin (ES6 target for Figma compatibility, no modules)

The plugin build pipeline: `tsc --noEmit` (type check) → `esbuild` (bundle) → copy assets

## Development Notes

- Server runs on port 3456 (HTTP + WebSocket)
- Commands timeout after 120 seconds
- Plugin uses `@figma/plugin-typings` for Figma API types
- Plugin maintains a node registry for referencing created elements by ID
- Colors accept hex strings (`#FF0000`), RGB objects, or RGBA objects
- Font loading is async - Inter is always available
- Query tools support compact mode to reduce response size
