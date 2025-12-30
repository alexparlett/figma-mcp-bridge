import type { Command } from "../../types/commands.js";

export function processData(data: Record<string, unknown>): Record<string, unknown> {
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
  if (typeof result.stroke === "string") {
    result.stroke = {
      color: result.stroke,
      weight: (result.strokeWeight as number) || 1,
      align: result.strokeAlign,
      dashPattern: result.dashPattern,
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
      dashPattern: result.dashPattern,
    };
    delete result.strokeColor;
    delete result.strokeWeight;
    delete result.strokeAlign;
    delete result.dashPattern;
  }
  return result;
}

export function processCommand(cmd: Command): Command {
  const processed = {
    type: cmd.type,
    id: cmd.id,
    data: cmd.data ? processData(cmd.data as Record<string, unknown>) : undefined,
    children: cmd.children ? cmd.children.map(processCommand) : undefined,
  } as Command;

  return processed;
}

export function findDependencies(cmd: Command, deps: Set<string> = new Set()): Set<string> {
  if (cmd.type === "CREATE_INSTANCE" && cmd.data?.componentId) {
    deps.add(cmd.data.componentId as string);
  }
  if (cmd.children && Array.isArray(cmd.children)) {
    cmd.children.forEach((child: Command) => findDependencies(child, deps));
  }
  return deps;
}

export function sortByDependencies(components: Command[]): Command[] {
  const componentMap = new Map(components.map((c) => [c.id!, c]));
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

  components.forEach((comp) => visit(comp));
  return sorted;
}
