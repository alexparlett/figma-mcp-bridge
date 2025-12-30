/// <reference types="@figma/plugin-typings" />

/**
 * Viewport and selection handlers for Figma MCP Bridge.
 */

import type { Command } from "../../types/commands.js";
import type { CommandResult } from "../../types/messages.js";
import type { SetSelectionData, ViewportData, NodeRefData } from "../../types/data.js";
import { resolveNode, resolveNodes } from "../utils.js";

// ============ SET SELECTION ============

export async function setSelection(cmd: Command): Promise<CommandResult> {
  const d = (cmd.data || {}) as SetSelectionData;

  if (!d.nodeIds || d.nodeIds.length === 0) {
    figma.currentPage.selection = [];
    return { success: true, data: { selectedCount: 0 } };
  }

  const nodes = resolveNodes(d.nodeIds);
  figma.currentPage.selection = nodes;

  return {
    success: true,
    data: {
      selectedCount: nodes.length,
      selectedIds: nodes.map(n => n.id)
    }
  };
}

// ============ ZOOM TO FIT ============

export async function zoomToFit(cmd: Command): Promise<CommandResult> {
  const d = (cmd.data || {}) as NodeRefData;

  if (d.nodeId || d.name) {
    const nodeId = d.nodeId || d.name;
    const node = resolveNode(nodeId!);

    if (!node) {
      return { success: false, error: `Node not found: ${nodeId}` };
    }

    figma.viewport.scrollAndZoomIntoView([node]);
    return {
      success: true,
      data: {
        zoomedTo: node.id,
        nodeName: node.name
      }
    };
  }

  if (figma.currentPage.selection.length > 0) {
    figma.viewport.scrollAndZoomIntoView(figma.currentPage.selection);
    return {
      success: true,
      data: {
        zoomedTo: 'selection',
        nodeCount: figma.currentPage.selection.length
      }
    };
  }

  const allNodes = figma.currentPage.children;
  if (allNodes.length > 0) {
    figma.viewport.scrollAndZoomIntoView(allNodes);
    return {
      success: true,
      data: {
        zoomedTo: 'page',
        nodeCount: allNodes.length
      }
    };
  }

  return { success: true, data: { zoomedTo: 'none' } };
}

// ============ GET VIEWPORT ============

export async function getViewport(): Promise<CommandResult> {
  return {
    success: true,
    data: {
      center: figma.viewport.center,
      zoom: figma.viewport.zoom,
      bounds: figma.viewport.bounds
    }
  };
}

// ============ SET VIEWPORT ============

export async function setViewport(cmd: Command): Promise<CommandResult> {
  const d = (cmd.data || {}) as ViewportData;

  if (d.x !== undefined && d.y !== undefined) {
    figma.viewport.center = { x: d.x, y: d.y };
  }

  if (d.zoom !== undefined) {
    figma.viewport.zoom = d.zoom;
  }

  return {
    success: true,
    data: {
      center: figma.viewport.center,
      zoom: figma.viewport.zoom
    }
  };
}
