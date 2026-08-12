import { describe, expect, it } from "vitest";
import type { Edge, Node } from "@xyflow/react";

import { createDiagramSvg } from "../../src/export/exportDiagram";
import type { DiagramEdgeData, DiagramNodeData } from "../../src/diagram/types";

const nodes: Array<Node<DiagramNodeData>> = [
  {
    id: "user",
    type: "umlClass",
    position: { x: 100, y: 80 },
    data: {
      label: "Usuario",
      kind: "class",
      style: { fill: "#ffffff", stroke: "#2563eb", text: "#111827" },
    },
  },
  {
    id: "order",
    type: "umlClass",
    position: { x: 420, y: 260 },
    data: {
      label: "Pedido",
      kind: "class",
      style: { fill: "#ffffff", stroke: "#2563eb", text: "#111827" },
    },
  },
];

const edges: Array<Edge<DiagramEdgeData>> = [
  {
    id: "user-order",
    source: "user",
    target: "order",
    data: {
      relation: "association",
      lineStyle: "curve",
      curveOffset: 0,
      arrowDirection: "forward",
    },
  },
];

describe("exportDiagram", () => {
  it("creates an svg with all nodes and edges", () => {
    const svg = createDiagramSvg({
      format: "svg",
      background: "white",
      scope: "all",
      resolution: "standard",
      canvasBackground: "light",
      diagramType: "class",
      source: "@startuml\n@enduml",
      nodes,
      edges,
      selectedNodeIds: [],
    });

    expect(svg).toContain("<svg");
    expect(svg).toContain("Usuario");
    expect(svg).toContain("Pedido");
    expect(svg).toContain('marker-end="url(#arrow)"');
    expect(svg).toContain('fill="#ffffff"');
  });

  it("exports only selected nodes and their valid edges", () => {
    const svg = createDiagramSvg({
      format: "svg",
      background: "white",
      scope: "selection",
      resolution: "standard",
      canvasBackground: "light",
      diagramType: "class",
      source: "@startuml\n@enduml",
      nodes,
      edges,
      selectedNodeIds: ["user"],
    });

    expect(svg).toContain("Usuario");
    expect(svg).not.toContain("Pedido");
    expect(svg).not.toContain('marker-end="url(#arrow)"');
  });

  it("can export with transparent background", () => {
    const svg = createDiagramSvg({
      format: "svg",
      background: "transparent",
      scope: "all",
      resolution: "standard",
      canvasBackground: "dark",
      diagramType: "class",
      source: "@startuml\n@enduml",
      nodes,
      edges,
      selectedNodeIds: [],
    });

    expect(svg).not.toContain('<rect width="100%" height="100%" fill="#0f172a"');
  });
});
