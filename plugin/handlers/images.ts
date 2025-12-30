/// <reference types="@figma/plugin-typings" />

/**
 * Image handlers for Figma MCP Bridge.
 */

import type { Command } from "../../types/commands.js";
import type { CommandResult } from "../../types/messages.js";
import type { SetImageFillData, CreateImageData, GetImageData } from "../../types/data.js";
import { resolveNode } from "../utils.js";

// ============ SET IMAGE FILL ============

export async function setImageFill(cmd: Command): Promise<BaseNode> {
  const d = (cmd.data || {}) as SetImageFillData;
  const nodeId = d.nodeId || d.name;

  const node = resolveNode(nodeId!);
  if (!node || !('fills' in node)) {
    throw new Error('Node not found or does not support fills: ' + nodeId);
  }

  const geometryNode = node as GeometryMixin;

  let imageHash: string;

  if (d.imageData) {
    const bytes = figma.base64Decode(d.imageData);
    const image = figma.createImage(bytes);
    imageHash = image.hash;
  } else if (d.imageHash) {
    imageHash = d.imageHash;
  } else {
    throw new Error('Either imageData (base64) or imageHash is required');
  }

  const imagePaint: ImagePaint = {
    type: 'IMAGE',
    imageHash: imageHash,
    scaleMode: d.scaleMode || 'FILL',
    visible: d.visible ?? true,
    opacity: d.opacity ?? 1,
    ...(d.imageTransform && { imageTransform: d.imageTransform }),
    ...(d.scalingFactor !== undefined && { scalingFactor: d.scalingFactor }),
    ...(d.rotation !== undefined && { rotation: d.rotation })
  };

  if (d.append) {
    const currentFills = geometryNode.fills as Paint[];
    geometryNode.fills = [...currentFills, imagePaint];
  } else {
    geometryNode.fills = [imagePaint];
  }

  return node;
}

// ============ CREATE IMAGE ============

export async function createImage(cmd: Command): Promise<CommandResult> {
  const d = (cmd.data || {}) as CreateImageData;

  if (!d.imageData) {
    throw new Error('imageData (base64) is required');
  }

  const bytes = figma.base64Decode(d.imageData);
  const image = figma.createImage(bytes);

  return {
    success: true,
    data: {
      imageHash: image.hash
    }
  };
}

// ============ GET IMAGE DATA ============

export async function getImageData(cmd: Command): Promise<CommandResult> {
  const d = (cmd.data || {}) as GetImageData;

  let imageHash: string;

  if (d.imageHash) {
    imageHash = d.imageHash;
  } else if (d.nodeId) {
    const node = resolveNode(d.nodeId);
    if (!node || !('fills' in node)) {
      throw new Error('Node not found or does not support fills: ' + d.nodeId);
    }

    const fills = (node as GeometryMixin).fills as Paint[];
    const imageFill = fills.find(f => f.type === 'IMAGE') as ImagePaint | undefined;

    if (!imageFill || !imageFill.imageHash) {
      throw new Error('Node does not have an image fill');
    }

    imageHash = imageFill.imageHash;
  } else {
    throw new Error('Either imageHash or nodeId is required');
  }

  const image = figma.getImageByHash(imageHash);
  if (!image) {
    throw new Error('Image not found: ' + imageHash);
  }

  const bytes = await image.getBytesAsync();
  const base64 = figma.base64Encode(bytes);

  return {
    success: true,
    data: {
      imageHash: imageHash,
      imageData: base64
    }
  };
}
