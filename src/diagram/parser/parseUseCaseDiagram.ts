import { ELEMENT_PALETTE } from "../elementPalette";
import type { ParserResult } from "../types";

export function parseUseCaseDiagram(source: string): ParserResult {
  const nodes = new Map<string, ParserResult["nodes"][number]>();
  const edges: ParserResult["edges"] = [];
  const errors: string[] = [];
  let index = 0;

  const lines = source
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter((line) => line && !line.startsWith("'") && !line.startsWith("@"));

  for (const line of lines) {
    const actorMatch = /^actor\s+("?[^"]+"?|[A-Za-z_][\w]*)/.exec(line);
    const relationMatch = /^([A-Za-z_][\w]*)\s+--?>\s+([A-Za-z_][\w]*)/.exec(line);
    const rectangleMatch = /^rectangle\s+"?([^"]+)"?/.exec(line);

    if (actorMatch) {
      const label = clean(actorMatch[1]);
      ensureNode(nodes, label, label, "actorNode", "actor", ELEMENT_PALETTE.usecase, index++);
      continue;
    }

    if (rectangleMatch) {
      const label = clean(rectangleMatch[1]);
      ensureNode(
        nodes,
        label,
        label,
        "systemBoundaryNode",
        "system-boundary",
        ELEMENT_PALETTE.neutral,
        index++,
      );
      continue;
    }

    if (line.startsWith("usecase")) {
      const quoted = /"([^"]+)"\s+as\s+([A-Za-z_][\w]*)/.exec(line);
      const simple = /^usecase\s+([A-Za-z_][\w]*)/.exec(line);
      const label = quoted?.[1] ?? simple?.[1];
      const id = quoted?.[2] ?? simple?.[1];

      if (!label || !id) {
        errors.push(`Caso de uso invalido: ${line}`);
        continue;
      }

      ensureNode(nodes, id, label, "useCaseNode", "usecase", ELEMENT_PALETTE.usecase, index++);
      continue;
    }

    if (relationMatch) {
      const [, source, target] = relationMatch;
      ensureNode(nodes, source, source, "actorNode", "actor", ELEMENT_PALETTE.usecase, index++);
      ensureNode(
        nodes,
        target,
        target,
        "useCaseNode",
        "usecase",
        ELEMENT_PALETTE.usecase,
        index++,
      );
      edges.push({
        id: `${source}-${target}-${edges.length}`,
        source,
        target,
        data: {
          relation: "association",
          lineStyle: "curve",
          curveOffset: 0,
          arrowDirection: "forward",
        },
      });
      continue;
    }

    errors.push(`Linea de caso de uso no soportada todavia: ${line}`);
  }

  return { nodes: Array.from(nodes.values()), edges, errors };
}

function ensureNode(
  nodes: Map<string, ParserResult["nodes"][number]>,
  id: string,
  label: string,
  type: ParserResult["nodes"][number]["type"],
  kind: ParserResult["nodes"][number]["data"]["kind"],
  style: ParserResult["nodes"][number]["data"]["style"],
  index: number,
) {
  if (nodes.has(id)) return;

  nodes.set(id, {
    id,
    type,
    position: { x: 100 + (index % 3) * 260, y: 100 + Math.floor(index / 3) * 170 },
    data: { label, kind, style },
  });
}

function clean(value: string) {
  return value.replace(/"/g, "").trim();
}
