import type { Node } from "@xyflow/react";

export function simpleGridLayout<T extends Record<string, unknown>>(nodes: Array<Node<T>>) {
  return nodes.map((node, index) => ({
    ...node,
    position: {
      x: 80 + (index % 3) * 240,
      y: 80 + Math.floor(index / 3) * 180,
    },
  }));
}
