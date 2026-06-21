import type { Edge, Node } from "@xyflow/react";

import type { DiagramEdgeData, DiagramNodeData } from "../types";

export function toPlantUml(nodes: Array<Node<DiagramNodeData>>, edges: Array<Edge<DiagramEdgeData>>) {
  const lines = ["@startuml"];

  for (const node of nodes) {
    lines.push(`${node.data.kind} ${node.data.label}`);
  }

  for (const edge of edges) {
    lines.push(`${edge.source} --> ${edge.target}${edge.data?.label ? ` : ${edge.data.label}` : ""}`);
  }

  lines.push("@enduml");
  return lines.join("\n");
}
