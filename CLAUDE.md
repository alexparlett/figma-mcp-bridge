# Figma MCP Bridge

This project enables Claude to create and manipulate designs in Figma via the Model Context Protocol (MCP).

## Architecture

- **`server/`** - MCP server that exposes Figma tools to Claude (TypeScript)
- **`plugin/`** - Figma plugin that executes commands from the MCP server (TypeScript)

Communication flow: Claude → MCP Server (stdio) → WebSocket → Figma Plugin → Figma API

## Build

```bash
npm install
npm run build          # Build both server and plugin
npm run build:server   # Build server only
npm run build:plugin   # Build plugin only
npm run watch          # Watch mode for development
```

## Running the MCP Server

Add to Claude Desktop config (`~/Library/Application Support/Claude/claude_desktop_config.json`):

```json
{
  "mcpServers": {
    "figma-bridge": {
      "command": "npx",
      "args": ["tsx", "/path/to/figma-mcp-bridge/server/server.ts"]
    }
  }
}
```

Or if built:
```json
{
  "mcpServers": {
    "figma-bridge": {
      "command": "node",
      "args": ["/path/to/figma-mcp-bridge/server/server.js"]
    }
  }
}
```

## Installing the Figma Plugin

1. Open Figma Desktop
2. Go to Plugins → Development → Import plugin from manifest
3. Select `plugin/manifest.json`
4. Run the plugin from Plugins menu - it will connect via WebSocket to the MCP server

## Key Files

- `server/server.ts` - MCP server with all Figma tool definitions
- `plugin/code.ts` - Figma plugin command handlers
- `plugin/ui.html` - Plugin UI (connection status indicator)

## Available Tools

### Creation
- `figma_create_frame` - Create container frames with auto-layout
- `figma_create_rectangle`, `figma_create_ellipse`, `figma_create_line` - Basic shapes
- `figma_create_text` - Text elements with font/style options
- `figma_create_component` - Reusable components
- `figma_create_instance` - Instances of components with overrides

### Batch Operations
- `figma_create_tree` - Create nested element hierarchies in one call
- `figma_define_components` - Define multiple components (auto-resolves dependencies)
- `figma_create_screen` - Create screens using component instances
- `figma_batch_commands` - Execute multiple commands in batch

### Reading
- `figma_get_selection` - Get currently selected nodes
- `figma_get_page_nodes` - List page contents
- `figma_get_node_by_id`, `figma_get_node_by_name`, `figma_find_nodes` - Find nodes
- `figma_get_styles`, `figma_get_components`, `figma_get_variables` - Get design system elements

### Modification
- `figma_update_node` - Update node properties
- `figma_move_node` - Reposition nodes
- `figma_delete_node` - Remove nodes

### Design Tokens
- `figma_create_variable_collection`, `figma_create_variable` - Variables/tokens
- `figma_create_text_style`, `figma_create_color_style` - Reusable styles

### Export
- `figma_export_node` - Export as PNG, SVG, JPG, PDF, or JSON

## TypeScript Configuration

The project uses separate tsconfig files:
- `tsconfig.base.json` - Shared settings
- `tsconfig.server.json` - Server (ES2022, ESM modules)
- `tsconfig.plugin.json` - Plugin (ES6 target for Figma compatibility, no modules)

## Development Notes

- The plugin uses `@figma/plugin-typings` for Figma API types
- Server runs on port 3456 (HTTP + WebSocket)
- Commands timeout after 120 seconds
- The plugin maintains a node registry for referencing created elements by ID
