import { describe, expect, it } from "vitest";

import { useDiagramStore } from "../../src/store/useDiagramStore";

describe("useDiagramStore phase 6 use case diagrams", () => {
  it("switches to use case diagrams and creates use case elements", () => {
    useDiagramStore.getState().setDiagramType("usecase");
    useDiagramStore.getState().clearCanvas({ confirm: false });
    useDiagramStore.getState().addNode("actor");
    useDiagramStore.getState().addNode("usecase");
    useDiagramStore.getState().addNode("system-boundary");

    const state = useDiagramStore.getState();
    expect(state.diagramType).toBe("usecase");
    expect(state.nodes.map((node) => node.data.kind)).toEqual([
      "actor",
      "usecase",
      "system-boundary",
    ]);
  });

  it("connects actor with use case and generates PlantUML", () => {
    const [actor, usecase] = useDiagramStore.getState().nodes;
    useDiagramStore.getState().selectNode(actor.id);
    useDiagramStore.getState().updateSelectedNodeLabel("Cliente");
    useDiagramStore.getState().selectNode(usecase.id);
    useDiagramStore.getState().updateSelectedNodeLabel("Comprar producto");
    useDiagramStore.getState().addEdge({
      source: actor.id,
      target: usecase.id,
      sourceHandle: "right-source",
      targetHandle: "left-target",
    });

    const generated = useDiagramStore
      .getState()
      .generateSourceFromVisual({ confirmOverwrite: false });

    expect(generated).toContain('actor "Cliente"');
    expect(generated).toContain('usecase "Comprar producto"');
    expect(generated).toContain("-->");
    expect(useDiagramStore.getState().errors).toHaveLength(0);
  });

  it("parses use case code from source", () => {
    useDiagramStore.getState().setDiagramType("usecase");
    useDiagramStore.getState().setSource(`@startuml
actor Cliente
usecase "Comprar producto" as Comprar
Cliente --> Comprar
@enduml`);
    useDiagramStore.getState().generateFromSource();

    expect(useDiagramStore.getState().nodes.map((node) => node.data.kind)).toEqual([
      "actor",
      "usecase",
    ]);
    expect(useDiagramStore.getState().edges).toHaveLength(1);
  });
});
