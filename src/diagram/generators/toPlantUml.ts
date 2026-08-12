import type { Edge, Node } from "@xyflow/react";

import type { DiagramEdgeData, DiagramNodeData } from "../types";

export function toPlantUml(
  nodes: Array<Node<DiagramNodeData>>,
  edges: Array<Edge<DiagramEdgeData>>,
) {
  const lines = ["@startuml"];
  const aliases = new Map<string, string>();

  for (const node of nodes) {
    if (node.data.kind === "note") {
      const alias = toAlias(node.id);
      aliases.set(node.id, alias);
      lines.push(`note "${escapeText(node.data.label)}" as ${alias}`);
      continue;
    }

    const alias = toAlias(node.data.label);
    aliases.set(node.id, alias);

    const keyword =
      node.data.kind === "interface" ? "interface" : node.data.kind === "enum" ? "enum" : "class";
    lines.push(`${keyword} ${alias}`);
  }

  for (const edge of edges) {
    const source = aliases.get(edge.source) ?? toAlias(edge.source);
    const target = aliases.get(edge.target) ?? toAlias(edge.target);
    const relation = toPlantUmlRelation(edge);
    const label = edge.data?.label ? ` : ${escapeText(edge.data.label)}` : "";

    lines.push(`${source} ${relation} ${target}${label}`);
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

function toPlantUmlRelation(edge: Edge<DiagramEdgeData>) {
  const relation = edge.data?.relation ?? "association";
  const pointsReverse = edge.data?.arrowDirection === "reverse";

  if (relation === "dependency") {
    return pointsReverse ? "<.." : "..>";
  }

  if (relation === "inheritance") {
    return pointsReverse ? "<|--" : "--|>";
  }

  if (relation === "composition") {
    return pointsReverse ? "--*" : "*--";
  }

  if (relation === "aggregation") {
    return pointsReverse ? "--o" : "o--";
  }

  return pointsReverse ? "<--" : "-->";
}
