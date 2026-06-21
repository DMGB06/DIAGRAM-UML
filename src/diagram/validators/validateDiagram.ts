import type { Edge, Node } from "@xyflow/react";

export function validateDiagram(nodes: Node[], edges: Edge[]) {
  const errors: string[] = [];
  const nodeIds = new Set(nodes.map((node) => node.id));

  for (const edge of edges) {
    if (!nodeIds.has(edge.source) || !nodeIds.has(edge.target)) {
      errors.push(`Relacion invalida: ${edge.id}`);
    }
  }

  return errors;
}
