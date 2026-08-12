import type { Node } from "@xyflow/react";

export function mergeNodePositions<T extends { label: string }>(
  previousNodes: Array<Node<T>>,
  parsedNodes: Array<Node<T>>,
): Array<Node<T>> {
  const previousById = new Map(previousNodes.map((node) => [node.id, node]));

  return parsedNodes.map((node) => {
    const previous = previousById.get(node.id);
    return previous ? { ...node, position: previous.position } : node;
  });
}
