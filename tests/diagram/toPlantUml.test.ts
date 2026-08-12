import type { Edge, Node } from "@xyflow/react";
import { describe, expect, it } from "vitest";

import { toPlantUml } from "../../src/diagram/generators/toPlantUml";
import { parseClassDiagram } from "../../src/diagram/parser/parseClassDiagram";
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

    expect(toPlantUml(nodes, [])).toContain("class Cliente");
    expect(toPlantUml(nodes, [])).toContain("class Pedido");
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

    expect(toPlantUml(nodes, edges)).toContain("Cliente --> Pedido");
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

  it("generates class declarations that parseClassDiagram can read back", () => {
    const nodes: Array<Node<DiagramNodeData>> = [
      {
        id: "Usuario",
        type: "umlClass",
        position: { x: 100, y: 100 },
        data: { label: "Usuario", kind: "class", style: baseStyle },
      },
    ];
    const generated = toPlantUml(nodes, []);
    const reparsed = parseClassDiagram(generated);

    expect(reparsed.errors).toEqual([]);
    expect(reparsed.nodes.map((node) => node.id)).toEqual(["Usuario"]);
  });

  it("uses node label for alias, not auto-generated id", () => {
    const nodes: Array<Node<DiagramNodeData>> = [
      {
        id: "class-1699999999999-1",
        type: "umlClass",
        position: { x: 100, y: 100 },
        data: { label: "Usuario", kind: "class", style: baseStyle },
      },
    ];
    const generated = toPlantUml(nodes, []);

    expect(generated).toContain("class Usuario");
    expect(generated).not.toContain("class-1699999999999-1");
  });

  it("correctly relates classes when id differs from label", () => {
    const nodes: Array<Node<DiagramNodeData>> = [
      {
        id: "class-1699999999999-1",
        type: "umlClass",
        position: { x: 100, y: 100 },
        data: { label: "Usuario", kind: "class", style: baseStyle },
      },
      {
        id: "class-1699999999999-2",
        type: "umlClass",
        position: { x: 500, y: 100 },
        data: { label: "Pedido", kind: "class", style: baseStyle },
      },
    ];
    const edges: Array<Edge<DiagramEdgeData>> = [
      {
        id: "edge-1",
        source: "class-1699999999999-1",
        target: "class-1699999999999-2",
        data: {
          relation: "association",
          lineStyle: "curve",
          curveOffset: 120,
          arrowDirection: "forward",
        },
      },
    ];

    const generated = toPlantUml(nodes, edges);

    expect(generated).toContain("class Usuario");
    expect(generated).toContain("class Pedido");
    expect(generated).toContain("Usuario --> Pedido");
    expect(generated).not.toContain("class-1699999999999-1");
    expect(generated).not.toContain("class-1699999999999-2");
  });

  it("keeps two nodes with the same label as distinct classes with unique aliases", () => {
    const nodes: Array<Node<DiagramNodeData>> = [
      {
        id: "class-1",
        type: "umlClass",
        position: { x: 100, y: 100 },
        data: { label: "Cliente", kind: "class", style: baseStyle },
      },
      {
        id: "class-2",
        type: "umlClass",
        position: { x: 300, y: 100 },
        data: { label: "Cliente", kind: "class", style: baseStyle },
      },
    ];
    const edges: Array<Edge<DiagramEdgeData>> = [
      {
        id: "edge-1",
        source: "class-1",
        target: "class-2",
        data: {
          relation: "association",
          lineStyle: "curve",
          curveOffset: 0,
          arrowDirection: "forward",
        },
      },
    ];

    const uml = toPlantUml(nodes, edges);
    const reparsed = parseClassDiagram(uml);

    expect(reparsed.errors).toEqual([]);
    expect(reparsed.nodes).toHaveLength(2);
  });
});
