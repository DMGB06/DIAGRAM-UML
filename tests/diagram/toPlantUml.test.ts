import type { Edge, Node } from "@xyflow/react";
import { describe, expect, it } from "vitest";

import { toPlantUml } from "../../src/diagram/generators/toPlantUml";
import type { DiagramEdgeData, DiagramNodeData } from "../../src/diagram/types";

const baseStyle = {
  fill: "#ffffff",
  stroke: "#111827",
  text: "#111827",
};

describe("toPlantUml", () => {
  it("generates class code from visual nodes", () => {
    const nodes: Array<Node<DiagramNodeData>> = [
      {
        id: "cliente",
        type: "umlClass",
        position: { x: 100, y: 100 },
        data: { label: "Cliente", kind: "class", style: baseStyle },
      },
      {
        id: "pedido",
        type: "umlClass",
        position: { x: 500, y: 100 },
        data: { label: "Pedido", kind: "class", style: baseStyle },
      },
    ];

    expect(toPlantUml(nodes, [])).toContain('class "Cliente" as cliente');
    expect(toPlantUml(nodes, [])).toContain('class "Pedido" as pedido');
  });

  it("generates relations from visual edges", () => {
    const nodes: Array<Node<DiagramNodeData>> = [
      {
        id: "cliente",
        type: "umlClass",
        position: { x: 100, y: 100 },
        data: { label: "Cliente", kind: "class", style: baseStyle },
      },
      {
        id: "pedido",
        type: "umlClass",
        position: { x: 500, y: 100 },
        data: { label: "Pedido", kind: "class", style: baseStyle },
      },
    ];
    const edges: Array<Edge<DiagramEdgeData>> = [
      {
        id: "edge-1",
        source: "cliente",
        target: "pedido",
        data: {
          relation: "association",
          lineStyle: "curve",
          curveOffset: 120,
          arrowDirection: "forward",
        },
      },
    ];

    expect(toPlantUml(nodes, edges)).toContain("cliente --> pedido");
  });

  it("does not include visual position or style metadata in generated UML", () => {
    const nodes: Array<Node<DiagramNodeData>> = [
      {
        id: "cliente",
        type: "umlClass",
        position: { x: 100, y: 100 },
        data: { label: "Cliente", kind: "class", style: baseStyle },
      },
    ];
    const uml = toPlantUml(nodes, []);

    expect(uml).not.toContain("position");
    expect(uml).not.toContain("#ffffff");
    expect(uml).not.toContain("100");
  });
});
