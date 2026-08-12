import { describe, expect, it } from "vitest";

import { useDiagramStore } from "../../src/store/useDiagramStore";

describe("useDiagramStore phase 3 visual to source sync", () => {
  it("updates source from visual nodes and edges", () => {
    useDiagramStore.getState().setNodes([]);
    useDiagramStore.getState().setEdges([]);
    useDiagramStore.getState().setSource("@startuml\n@enduml");
    useDiagramStore.getState().addNode("class");
    useDiagramStore.getState().addNode("class");

    const [source, target] = useDiagramStore.getState().nodes;
    useDiagramStore.getState().selectNode(source.id);
    useDiagramStore.getState().updateSelectedNodeLabel("Cliente");
    useDiagramStore.getState().selectNode(target.id);
    useDiagramStore.getState().updateSelectedNodeLabel("Pedido");
    useDiagramStore.getState().addEdge({
      source: source.id,
      target: target.id,
      sourceHandle: "right-source",
      targetHandle: "left-target",
    });

    const generated = useDiagramStore
      .getState()
      .generateSourceFromVisual({ confirmOverwrite: false });
    expect(generated).toMatch(/class\s+\w+/);
    expect(generated).toContain("-->");
    expect(useDiagramStore.getState().source).toBe(generated);
  });

  it("does not require confirmation when explicitly disabled", () => {
    useDiagramStore.getState().setSource("manual source");

    const result = useDiagramStore.getState().generateSourceFromVisual({ confirmOverwrite: false });

    expect(result).toBeDefined();
    expect(useDiagramStore.getState().source).toBe(result);
  });
});
