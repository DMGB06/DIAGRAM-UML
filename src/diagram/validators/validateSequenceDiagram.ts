import type { Edge, Node } from "@xyflow/react";

import type { DiagramEdgeData, DiagramNodeData } from "../types";

export function validateSequenceDiagram(
  nodes: Array<Node<DiagramNodeData>>,
  edges: Array<Edge<DiagramEdgeData>>,
) {
  const errors: string[] = [];
  const participants = nodes.filter((node) => node.data.kind === "participant");

  if (participants.length < 2) {
    errors.push("El diagrama de secuencia necesita al menos dos participantes.");
  }

  if (participants.length >= 2 && edges.length === 0) {
    errors.push("El diagrama de secuencia necesita al menos un mensaje.");
  }

  return errors;
}
