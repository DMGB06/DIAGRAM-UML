import { describe, expect, it } from "vitest";

import { useDiagramStore } from "../../src/store/useDiagramStore";

describe("useDiagramStore phase 1 behavior", () => {
  it("starts with a light canvas background", () => {
    expect(useDiagramStore.getState().canvasBackground).toBe("light");
  });

  it("generates class diagram nodes and edges from source", () => {
    const store = useDiagramStore.getState();

    store.setSource(`@startuml
class Usuario
class Pedido
Usuario --> Pedido
@enduml`);
    store.generateFromSource();

    const state = useDiagramStore.getState();
    expect(state.nodes.map((node) => node.id)).toEqual(["Usuario", "Pedido"]);
    expect(state.edges).toHaveLength(1);
    expect(state.errors).toHaveLength(0);
  });

  it("moves a node without changing other nodes", () => {
    useDiagramStore.getState().generateFromSource();
    useDiagramStore.getState().updateNodePosition("Usuario", { x: 320, y: 240 });

    const state = useDiagramStore.getState();
    expect(state.nodes.find((node) => node.id === "Usuario")?.position).toEqual({ x: 320, y: 240 });
    expect(state.nodes.find((node) => node.id === "Pedido")?.position).toBeDefined();
  });

  it("selects nodes and edges exclusively", () => {
    useDiagramStore.getState().generateFromSource();
    const edgeId = useDiagramStore.getState().edges[0].id;

    useDiagramStore.getState().selectNode("Usuario");
    expect(useDiagramStore.getState().selectedNodeId).toBe("Usuario");
    expect(useDiagramStore.getState().selectedEdgeId).toBeUndefined();

    useDiagramStore.getState().selectEdge(edgeId);
    expect(useDiagramStore.getState().selectedEdgeId).toBe(edgeId);
    expect(useDiagramStore.getState().selectedNodeId).toBeUndefined();
  });

  it("reverses only the arrow head without swapping connected nodes", () => {
    useDiagramStore.getState().generateFromSource();
    const originalEdge = useDiagramStore.getState().edges[0];

    useDiagramStore.getState().selectEdge(originalEdge.id);
    useDiagramStore.getState().reverseSelectedEdge();

    const reversedEdge = useDiagramStore.getState().edges[0];
    expect(reversedEdge.source).toBe(originalEdge.source);
    expect(reversedEdge.target).toBe(originalEdge.target);
    expect(reversedEdge.data?.arrowDirection).toBe("reverse");
    expect(reversedEdge.markerStart).toBeDefined();
    expect(reversedEdge.markerEnd).toBeUndefined();
  });

  it("updates source and target connection sides", () => {
    useDiagramStore.getState().generateFromSource();
    const edgeId = useDiagramStore.getState().edges[0].id;

    useDiagramStore.getState().selectEdge(edgeId);
    useDiagramStore.getState().updateSelectedEdgeConnectionSide("source", "bottom");
    useDiagramStore.getState().updateSelectedEdgeConnectionSide("target", "top");

    const edge = useDiagramStore.getState().edges[0];
    expect(edge.sourceHandle).toBe("bottom-source");
    expect(edge.targetHandle).toBe("top-target");
  });
});
