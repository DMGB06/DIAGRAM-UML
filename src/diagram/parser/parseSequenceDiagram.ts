import type { ParserResult } from "../types";

const participantStyle = { fill: "#ffffff", stroke: "#2563eb", text: "#111827" };

export function parseSequenceDiagram(source: string): ParserResult {
  const nodes = new Map<string, ParserResult["nodes"][number]>();
  const edges: ParserResult["edges"] = [];
  const errors: string[] = [];
  let participantIndex = 0;
  let messageOrder = 1;

  const lines = source
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter((line) => line && !line.startsWith("'") && !line.startsWith("@"));

  for (const line of lines) {
    const participantMatch = /^(participant|actor)\s+"?([^"]+)"?(?:\s+as\s+([A-Za-z_][\w]*))?/.exec(
      line,
    );
    const messageMatch = /^([A-Za-z_][\w]*)\s+(--?>|-->>)\s+([A-Za-z_][\w]*)\s*:?\s*(.*)$/.exec(
      line,
    );

    if (participantMatch) {
      const [, , label, alias] = participantMatch;
      ensureParticipant(nodes, alias ?? label, label, participantIndex++);
      continue;
    }

    if (messageMatch) {
      const [, sourceId, arrow, targetId, label] = messageMatch;
      ensureParticipant(nodes, sourceId, sourceId, participantIndex++);
      ensureParticipant(nodes, targetId, targetId, participantIndex++);
      edges.push({
        id: `${sourceId}-${targetId}-${messageOrder}`,
        source: sourceId,
        target: targetId,
        data: {
          label: label || `mensaje ${messageOrder}`,
          relation: "association",
          lineStyle: "straight",
          curveOffset: 0,
          arrowDirection: "forward",
          messageKind: arrow === "-->>" ? "response" : "message",
          order: messageOrder,
        },
      });
      messageOrder += 1;
      continue;
    }

    errors.push(`Linea de secuencia no soportada todavia: ${line}`);
  }

  return { nodes: Array.from(nodes.values()), edges, errors };
}

function ensureParticipant(
  nodes: Map<string, ParserResult["nodes"][number]>,
  id: string,
  label: string,
  index: number,
) {
  if (nodes.has(id)) return;

  nodes.set(id, {
    id,
    type: "participantNode",
    position: { x: 120 + index * 240, y: 80 },
    data: {
      label,
      kind: "participant",
      style: participantStyle,
    },
  });
}
