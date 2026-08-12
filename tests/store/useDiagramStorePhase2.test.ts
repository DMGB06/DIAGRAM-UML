import { describe, expect, it } from "vitest";

import { useDiagramStore } from "../../src/store/useDiagramStore";

describe("useDiagramStore phase 2 manual editing", () => {
  it("adds class, interface, enum and note nodes manually", () => {
    useDiagramStore.getState().setNodes([]);
    useDiagramStore.getState().setEdges([]);

    useDiagramStore.getState().addNode("class");
    useDiagramStore.getState().addNode("interface");
    useDiagramStore.getState().addNode("enum");
    useDiagramStore.getState().addNode("note");

    const kinds = useDiagramStore.getState().nodes.map((node) => node.data.kind);
    expect(kinds).toEqual(["class", "interface", "enum", "note"]);
  });

  it("adds a manual edge from a connection", () => {
    const [source, target] = useDiagramStore.getState().nodes;

    useDiagramStore.getState().addEdge({
      source: source.id,
      target: target.id,
      sourceHandle: "right-source",
      targetHandle: "left-target",
    });

    const edge = useDiagramStore.getState().edges[0];
    expect(edge.source).toBe(source.id);
    expect(edge.target).toBe(target.id);
    expect(edge.type).toBe("umlEditable");
    expect(edge.sourceHandle).toBe("right-source");
    expect(edge.targetHandle).toBe("left-target");
  });

  it("edits selected node label, fill, stroke and text colors", () => {
    const nodeId = useDiagramStore.getState().nodes[0].id;

    useDiagramStore.getState().selectNode(nodeId);
    useDiagramStore.getState().updateSelectedNodeLabel("Cliente");
    useDiagramStore.getState().updateSelectedNodeColor("#ffffff");
    useDiagramStore.getState().updateSelectedNodeStroke("#111827");
    useDiagramStore.getState().updateSelectedNodeTextColor("#334155");

    const node = useDiagramStore.getState().nodes.find((item) => item.id === nodeId);
    expect(node?.data.label).toBe("Cliente");
    expect(node?.data.style.fill).toBe("#ffffff");
    expect(node?.data.style.stroke).toBe("#111827");
    expect(node?.data.style.text).toBe("#334155");
  });

  it("deletes selected edges", () => {
    const edgeId = useDiagramStore.getState().edges[0].id;

    useDiagramStore.getState().selectEdge(edgeId);
    useDiagramStore.getState().deleteSelected();

    expect(useDiagramStore.getState().edges.find((edge) => edge.id === edgeId)).toBeUndefined();
  });

  it("deletes selected nodes and connected edges", () => {
    const state = useDiagramStore.getState();
    const [source, target] = state.nodes;

    state.addEdge({
      source: source.id,
      target: target.id,
      sourceHandle: "right-source",
      targetHandle: "left-target",
    });

    useDiagramStore.getState().selectNode(source.id);
    useDiagramStore.getState().deleteSelected();

    expect(useDiagramStore.getState().nodes.find((node) => node.id === source.id)).toBeUndefined();
    expect(
      useDiagramStore
        .getState()
        .edges.some((edge) => edge.source === source.id || edge.target === source.id),
    ).toBe(false);
  });
});
