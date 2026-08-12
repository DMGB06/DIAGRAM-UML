import type { Node } from "@xyflow/react";

import type { DiagramNodeData } from "../types";

export function validateActivityDiagram(nodes: Array<Node<DiagramNodeData>>) {
  const errors: string[] = [];
  const hasStart = nodes.some((node) => node.data.kind === "activity-start");
  const hasEnd = nodes.some((node) => node.data.kind === "activity-end");

  if (!hasStart) {
    errors.push("El diagrama de actividades necesita un nodo de inicio.");
  }

  if (!hasEnd) {
    errors.push("El diagrama de actividades necesita un nodo de fin.");
  }

  return errors;
}
