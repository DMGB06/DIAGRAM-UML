import type { Edge, Node } from "@xyflow/react";

import type { DiagramEdgeData, DiagramNodeData } from "../types";

export function toPlantUmlActivity(
  nodes: Array<Node<DiagramNodeData>>,
  _edges: Array<Edge<DiagramEdgeData>>,
) {
  const lines = ["@startuml"];
  const orderedNodes = [...nodes].sort((a, b) => a.position.y - b.position.y);

  for (const node of orderedNodes) {
    if (node.data.kind === "activity-start") {
      lines.push("start");
      continue;
    }

    if (node.data.kind === "activity-end") {
      lines.push("stop");
      continue;
    }

    if (node.data.kind === "activity-decision") {
      lines.push(`if (${escapeText(node.data.label)}) then (si)`);
      lines.push("endif");
      continue;
    }

    if (node.data.kind === "activity") {
      lines.push(`:${escapeText(node.data.label)};`);
    }
  }

  lines.push("@enduml");
  return lines.join("\n");
}

function escapeText(value: string) {
  return value.replace(/"/g, '\\"');
}
