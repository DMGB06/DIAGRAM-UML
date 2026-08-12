import type { Edge, Node } from "@xyflow/react";

import type { DiagramEdgeData, DiagramNodeData } from "../types";

export function toPlantUmlUseCase(
  nodes: Array<Node<DiagramNodeData>>,
  edges: Array<Edge<DiagramEdgeData>>,
) {
  const lines = ["@startuml"];
  const aliases = new Map<string, string>();

  for (const node of nodes) {
    const alias = toAlias(node.id);
    aliases.set(node.id, alias);

    if (node.data.kind === "actor") {
      lines.push(`actor "${escapeText(node.data.label)}" as ${alias}`);
    } else if (node.data.kind === "usecase") {
      lines.push(`usecase "${escapeText(node.data.label)}" as ${alias}`);
    } else if (node.data.kind === "system-boundary") {
      lines.push(`rectangle "${escapeText(node.data.label)}" as ${alias}`);
    } else if (node.data.kind === "note") {
      lines.push(`note "${escapeText(node.data.label)}" as ${alias}`);
    }
  }

  for (const edge of edges) {
    const source = aliases.get(edge.source) ?? toAlias(edge.source);
    const target = aliases.get(edge.target) ?? toAlias(edge.target);
    lines.push(
      `${source} --> ${target}${edge.data?.label ? ` : ${escapeText(edge.data.label)}` : ""}`,
    );
  }

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
