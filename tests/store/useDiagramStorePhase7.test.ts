import { describe, expect, it } from "vitest";

import { useDiagramStore } from "../../src/store/useDiagramStore";

describe("useDiagramStore phase 7 sequence diagrams", () => {
  it("switches to sequence and creates participants with sequence layout", () => {
    useDiagramStore.getState().setDiagramType("sequence");
    useDiagramStore.getState().clearCanvas({ confirm: false });
    useDiagramStore.getState().addNode("participant");
    useDiagramStore.getState().addNode("participant");

    const state = useDiagramStore.getState();
    expect(state.diagramType).toBe("sequence");
    expect(state.nodes.map((node) => node.data.kind)).toEqual(["participant", "participant"]);
    expect(state.nodes[0].position.y).toBe(80);
    expect(state.nodes[1].position.x).toBeGreaterThan(state.nodes[0].position.x);
  });

  it("creates editable ordered messages between participants", () => {
    const [source, target] = useDiagramStore.getState().nodes;
    useDiagramStore.getState().addEdge({
      source: source.id,
      target: target.id,
      sourceHandle: "right-source",
      targetHandle: "left-target",
    });
    const edge = useDiagramStore.getState().edges[0];

    useDiagramStore.getState().selectEdge(edge.id);
    useDiagramStore.getState().updateSelectedEdgeLabel("Solicitar acceso");
    useDiagramStore.getState().updateSelectedEdgeMessageKind("response");

    const updated = useDiagramStore.getState().edges[0];
    expect(updated.data?.label).toBe("Solicitar acceso");
    expect(updated.data?.messageKind).toBe("response");
    expect(updated.data?.order).toBe(1);
  });

  it("generates and parses sequence PlantUML", () => {
    const generated = useDiagramStore
      .getState()
      .generateSourceFromVisual({ confirmOverwrite: false });
    expect(generated).toContain("participant");
    expect(generated).toContain("-->>");

    useDiagramStore.getState().setSource(`@startuml
participant "Cliente" as Cliente
participant "Sistema" as Sistema
Cliente -> Sistema: Solicitar acceso
@enduml`);
    useDiagramStore.getState().generateFromSource();

    expect(useDiagramStore.getState().nodes).toHaveLength(2);
    expect(useDiagramStore.getState().edges[0].data?.label).toBe("Solicitar acceso");
  });
});
