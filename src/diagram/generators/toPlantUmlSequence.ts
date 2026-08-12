import type { Edge, Node } from "@xyflow/react";

import type { DiagramEdgeData, DiagramNodeData } from "../types";

export function toPlantUmlSequence(
  nodes: Array<Node<DiagramNodeData>>,
  edges: Array<Edge<DiagramEdgeData>>,
) {
  const lines = ["@startuml"];
  const participants = nodes.filter((node) => node.data.kind === "participant");
  const aliases = new Map<string, string>();

  participants.forEach((node) => {
    const alias = toAlias(node.id);
    aliases.set(node.id, alias);
    lines.push(`participant "${escapeText(node.data.label)}" as ${alias}`);
  });

  [...edges]
    .sort((a, b) => (a.data?.order ?? 0) - (b.data?.order ?? 0))
    .forEach((edge) => {
      const source = aliases.get(edge.source) ?? toAlias(edge.source);
      const target = aliases.get(edge.target) ?? toAlias(edge.target);
      const arrow = edge.data?.messageKind === "response" ? "-->>" : "->";
      lines.push(`${source} ${arrow} ${target}: ${escapeText(edge.data?.label ?? "mensaje")}`);
    });

  lines.push("@enduml");
  return lines.join("\n");
}

function toAlias(value: string) {
  const alias = value.replace(/[^A-Za-z0-9_]/g, "_");
  return /^[A-Za-z_]/.test(alias) ? alias : `N_${alias}`;
}

function escapeText(value: string) {
  return value.replace(/"/g, '\\"');
}
