import { ELEMENT_PALETTE } from "../elementPalette";
import type { ParserResult } from "../types";

export function parseActivityDiagram(source: string): ParserResult {
  const nodes: ParserResult["nodes"] = [];
  const edges: ParserResult["edges"] = [];
  const errors: string[] = [];
  let previousId: string | undefined;

  const lines = source
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter((line) => line && !line.startsWith("'") && !line.startsWith("@"));

  lines.forEach((line, index) => {
    const position = { x: 180, y: 80 + index * 150 };
    let node: ParserResult["nodes"][number] | undefined;

    if (line === "start") {
      node = {
        id: `start-${index}`,
        type: "startEndNode",
        position,
        data: { label: "Inicio", kind: "activity-start", style: ELEMENT_PALETTE.terminal },
      };
    } else if (line === "stop" || line === "end") {
      node = {
        id: `end-${index}`,
        type: "startEndNode",
        position,
        data: { label: "Fin", kind: "activity-end", style: ELEMENT_PALETTE.terminal },
      };
    } else if (line.startsWith(":") && line.endsWith(";")) {
      node = {
        id: `activity-${index}`,
        type: "activityNode",
        position,
        data: { label: line.slice(1, -1), kind: "activity", style: ELEMENT_PALETTE.activity },
      };
    } else if (line.startsWith("if ") || line.startsWith("if(")) {
      const label = line
        .replace(/^if\s*/, "")
        .replace(/\s*then.*$/, "")
        .replace(/[()]/g, "");
      node = {
        id: `decision-${index}`,
        type: "decisionNode",
        position,
        data: { label: label || "Decision", kind: "activity-decision", style: ELEMENT_PALETTE.activity },
      };
    } else if (line.startsWith("else") || line === "endif") {
      return;
    } else {
      errors.push(`Linea de actividad no soportada todavia: ${line}`);
      return;
    }

    nodes.push(node);

    if (previousId) {
      edges.push({
        id: `${previousId}-${node.id}`,
        source: previousId,
        target: node.id,
        data: {
          relation: "association",
          lineStyle: "curve",
          curveOffset: 0,
          arrowDirection: "forward",
        },
      });
    }

    previousId = node.id;
  });

  return { nodes, edges, errors };
}
