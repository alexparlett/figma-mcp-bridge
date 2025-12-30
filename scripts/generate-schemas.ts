/**
 * Schema Generator Script
 *
 * Generates JSON schemas from TypeScript *Data types using ts-json-schema-generator.
 * Uses tool-metadata.ts for tool definitions and generates inputSchema from types.
 *
 * As of MCP SDK v0.18.3, full JSON schema is supported, so we pass through $ref and definitions.
 */

import { createGenerator, Config, Schema } from 'ts-json-schema-generator';
import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';
import { toolMetadata } from '../server/tools/tool-metadata.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const config: Config = {
  path: path.resolve(__dirname, '../types/data.ts'),
  tsconfig: path.resolve(__dirname, '../tsconfig.server.json'),
  type: '*', // Generate for all exported types
  expose: 'export',
  topRef: false,
  jsDoc: 'extended', // Include JSDoc comments as descriptions
  skipTypeCheck: true,
  encodeRefs: false,
};

function generateSchemas() {
  console.log('Generating schemas from types/data.ts using tool-metadata.ts...');

  const generator = createGenerator(config);

  // Generate schemas for each tool based on metadata
  const toolSchemas: Array<{
    name: string;
    description: string;
    commandType: string;
    inputSchema: Schema;
    required?: string[];
    isFetchCommand?: boolean;
  }> = [];

  for (const meta of toolMetadata) {
    let schema: Schema;

    if (meta.dataType === 'none' || meta.dataType === 'undefined') {
      // No data type - empty object schema
      schema = { type: 'object', properties: {} };
    } else {
      try {
        schema = generator.createSchema(meta.dataType);
      } catch (e) {
        console.warn(`  ⚠ Could not generate schema for ${meta.dataType}: ${e}`);
        schema = { type: 'object', properties: {} };
      }
    }

    // Clean up the schema - remove MCP annotations that ended up in the schema
    const cleanSchema = cleanupSchema(schema);

    toolSchemas.push({
      name: meta.name,
      description: meta.description,
      commandType: meta.commandType,
      inputSchema: cleanSchema,
      required: meta.required,
      isFetchCommand: meta.isFetchCommand,
    });

    console.log(`  ✓ ${meta.name} → ${meta.dataType}`);
  }

  console.log(`\nGenerated ${toolSchemas.length} tool schemas`);

  // Write output
  const outputPath = path.resolve(__dirname, '../server/tools/generated-schemas.ts');
  const output = generateTypeScriptOutput(toolSchemas);
  fs.writeFileSync(outputPath, output);
  console.log(`Written to ${outputPath}`);
}

/**
 * Remove MCP-specific annotations from schema that shouldn't be in inputSchema
 */
function cleanupSchema(schema: Schema): Schema {
  const cleaned = { ...schema } as Record<string, unknown>;

  // Remove MCP annotations from top level
  delete cleaned.mcpTool;
  delete cleaned.mcpCommand;
  delete cleaned.mcpRequired;
  delete cleaned.mcpFetch;

  // Clean definitions too
  if (cleaned.definitions && typeof cleaned.definitions === 'object') {
    const defs = cleaned.definitions as Record<string, Record<string, unknown>>;
    for (const key of Object.keys(defs)) {
      if (defs[key] && typeof defs[key] === 'object') {
        delete defs[key].mcpTool;
        delete defs[key].mcpCommand;
        delete defs[key].mcpRequired;
        delete defs[key].mcpFetch;
      }
    }
  }

  return cleaned as Schema;
}

interface GeneratedTool {
  name: string;
  description: string;
  commandType: string;
  inputSchema: Schema;
  required?: string[];
  isFetchCommand?: boolean;
}

function generateTypeScriptOutput(toolSchemas: GeneratedTool[]): string {
  const lines: string[] = [
    '/**',
    ' * Auto-generated JSON schemas for MCP tools.',
    ' * DO NOT EDIT - regenerate with: npx tsx scripts/generate-schemas.ts',
    ' * ',
    ' * MCP SDK v0.18.3+ supports full JSON schema with $ref and definitions.',
    ' */',
    '',
    'import type { CommandType } from \'../../types/commands.js\';',
    '',
    'export interface ToolSchema {',
    '  name: string;',
    '  description: string;',
    '  commandType: CommandType;',
    '  inputSchema: Record<string, unknown>;',
    '  isFetchCommand?: boolean;',
    '}',
    '',
    'export const generatedTools: ToolSchema[] = [',
  ];

  for (const tool of toolSchemas) {
    // Add required to the schema if specified
    const schemaWithRequired = { ...tool.inputSchema };
    if (tool.required && tool.required.length > 0) {
      schemaWithRequired.required = tool.required;
    }

    lines.push(`  // ${tool.name}`);
    lines.push(`  {`);
    lines.push(`    name: ${JSON.stringify(tool.name)},`);
    lines.push(`    description: ${JSON.stringify(tool.description)},`);
    lines.push(`    commandType: ${JSON.stringify(tool.commandType)} as CommandType,`);
    lines.push(`    inputSchema: ${JSON.stringify(schemaWithRequired, null, 4).split('\n').join('\n    ')},`);
    if (tool.isFetchCommand) {
      lines.push(`    isFetchCommand: true,`);
    }
    lines.push(`  },`);
  }

  lines.push('];');
  lines.push('');
  lines.push('/** Map from tool name to schema for quick lookup */');
  lines.push('export const toolSchemaByName = new Map(');
  lines.push('  generatedTools.map((t) => [t.name, t])');
  lines.push(');');
  lines.push('');
  lines.push('/** Map from command type to tool for quick lookup */');
  lines.push('export const toolByCommandType = new Map(');
  lines.push('  generatedTools.map((t) => [t.commandType, t])');
  lines.push(');');
  lines.push('');
  lines.push('/** Set of command types that return data (fetch/query commands) */');
  lines.push('export const fetchCommandTypes = new Set(');
  lines.push('  generatedTools.filter((t) => t.isFetchCommand).map((t) => t.commandType)');
  lines.push(');');
  lines.push('');

  return lines.join('\n');
}

generateSchemas();
