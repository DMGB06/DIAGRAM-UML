import type { ParserResult } from "../types";

const DEFAULT_STYLE = {
  fill: "#e8f1ff",
  stroke: "#2f5d9f",
  text: "#111827",
};

const relationMap = [
  { token: "--|>", relation: "inheritance" },
  { token: "..>", relation: "dependency" },
  { token: "*--", relation: "composition" },
  { token: "o--", relation: "aggregation" },
  { token: "-->", relation: "association" },
  { token: "--", relation: "association" },
] as const;

export function parseClassDiagram(source: string): ParserResult {
  const nodes = new Map<string, ParserResult["nodes"][number]>();
  const edges: ParserResult["edges"] = [];
  const errors: string[] = [];
  let index = 0;

  const lines = source
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter((line) => line && !line.startsWith("'") && !line.startsWith("@"));

  for (const line of lines) {
    const classMatch = /^(class|interface|enum)\s+([A-Za-z_][\w]*)/.exec(line);

    if (classMatch) {
      const [, kind, name] = classMatch;
      ensureNode(nodes, name, kind as "class" | "interface" | "enum", index++);
      continue;
    }

    const relation = relationMap.find((item) => line.includes(item.token));

    if (relation) {
      const [left, rightWithLabel] = line.split(relation.token).map((part) => part.trim());
      const [right, label] = rightWithLabel.split(":").map((part) => part.trim());
      const sourceId = sanitizeName(left);
      const targetId = sanitizeName(right);

      if (!sourceId || !targetId) {
        errors.push(`Relacion invalida: ${line}`);
        continue;
      }

      ensureNode(nodes, sourceId, "class", index++);
      ensureNode(nodes, targetId, "class", index++);

      edges.push({
        id: `${sourceId}-${targetId}-${edges.length}`,
        source: sourceId,
        target: targetId,
        data: {
          label,
          relation: relation.relation,
          lineStyle: "curve",
          curveOffset: 0,
          arrowDirection: "forward",
        },
      });
      continue;
    }

    errors.push(`Linea no soportada todavia: ${line}`);
  }

  return {
    nodes: Array.from(nodes.values()),
    edges,
    errors,
  };
}

function ensureNode(
  nodes: Map<string, ParserResult["nodes"][number]>,
  name: string,
  kind: "class" | "interface" | "enum",
  index: number,
) {
  const id = sanitizeName(name);

  if (nodes.has(id)) {
    return;
  }

  nodes.set(id, {
    id,
    type: "umlClass",
    position: {
      x: 80 + (index % 3) * 240,
      y: 80 + Math.floor(index / 3) * 180,
    },
    data: {
      label: id,
      kind,
      style: DEFAULT_STYLE,
    },
  });
}

function sanitizeName(value: string) {
  return value.replace(/["{}]/g, "").trim();
}
