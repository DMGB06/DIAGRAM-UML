import { describe, expect, it } from "vitest";

import { useDiagramStore } from "../../src/store/useDiagramStore";

describe("useDiagramStore phase 8 professional editing", () => {
  it("undoes and redoes an action", () => {
    useDiagramStore.getState().newProject({ confirm: false });
    useDiagramStore.getState().addNode("class");
    expect(useDiagramStore.getState().nodes).toHaveLength(1);

    useDiagramStore.getState().undo();
    expect(useDiagramStore.getState().nodes).toHaveLength(0);

    useDiagramStore.getState().redo();
    expect(useDiagramStore.getState().nodes).toHaveLength(1);
  });

  it("selects multiple nodes and aligns them", () => {
    useDiagramStore.getState().newProject({ confirm: false });
    useDiagramStore.getState().addNode("class");
    useDiagramStore.getState().addNode("class");
    const [a, b] = useDiagramStore.getState().nodes;

    useDiagramStore.getState().updateNodePosition(a.id, { x: 100, y: 100 });
    useDiagramStore.getState().updateNodePosition(b.id, { x: 300, y: 250 });
    useDiagramStore.getState().setSelectedNodes([a.id, b.id]);
    useDiagramStore.getState().alignSelectedNodes("horizontal");

    const state = useDiagramStore.getState();
    expect(state.selectedNodeIds).toEqual([a.id, b.id]);
    expect(state.nodes[0].position.y).toBe(state.nodes[1].position.y);
  });

  it("distributes selected nodes", () => {
    useDiagramStore.getState().newProject({ confirm: false });
    useDiagramStore.getState().addNode("class");
    useDiagramStore.getState().addNode("class");
    useDiagramStore.getState().addNode("class");
    const [a, b, c] = useDiagramStore.getState().nodes;

    useDiagramStore.getState().updateNodePosition(a.id, { x: 100, y: 100 });
    useDiagramStore.getState().updateNodePosition(b.id, { x: 500, y: 100 });
    useDiagramStore.getState().updateNodePosition(c.id, { x: 900, y: 100 });
    useDiagramStore.getState().setSelectedNodes([a.id, b.id, c.id]);
    useDiagramStore.getState().distributeSelectedNodes("horizontal");

    expect(useDiagramStore.getState().nodes[1].position.x).toBe(500);
  });

  it("duplicates selected nodes", () => {
    useDiagramStore.getState().newProject({ confirm: false });
    useDiagramStore.getState().addNode("class");
    const node = useDiagramStore.getState().nodes[0];

    useDiagramStore.getState().setSelectedNodes([node.id]);
    useDiagramStore.getState().duplicateSelectedNodes();

    expect(useDiagramStore.getState().nodes).toHaveLength(2);
  });

  it("clears the canvas without confirmation when requested", () => {
    useDiagramStore.getState().newProject({ confirm: false });
    useDiagramStore.getState().addNode("class");
    useDiagramStore.getState().clearCanvas({ confirm: false });

    expect(useDiagramStore.getState().nodes).toHaveLength(0);
    expect(useDiagramStore.getState().edges).toHaveLength(0);
  });

  it("does not notify subscribers when the same selection is applied again", () => {
    useDiagramStore.getState().newProject({ confirm: false });
    useDiagramStore.getState().addNode("class");
    const node = useDiagramStore.getState().nodes[0];
    useDiagramStore.getState().selectNode(undefined);
    let notifications = 0;
    const unsubscribe = useDiagramStore.subscribe(() => {
      notifications += 1;
    });

    useDiagramStore.getState().setSelectedNodes([node.id]);
    useDiagramStore.getState().setSelectedNodes([node.id]);
    unsubscribe();

    expect(notifications).toBe(1);
  });
});
