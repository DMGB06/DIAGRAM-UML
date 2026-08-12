import { describe, expect, it } from "vitest";

import { useDiagramStore } from "../../src/store/useDiagramStore";

describe("useDiagramStore phase 5 activity diagrams", () => {
  it("switches to activity diagrams and creates activity elements", () => {
    useDiagramStore.getState().setDiagramType("activity");
    useDiagramStore.getState().clearCanvas({ confirm: false });
    useDiagramStore.getState().addNode("activity-start");
    useDiagramStore.getState().addNode("activity");
    useDiagramStore.getState().addNode("activity-decision");
    useDiagramStore.getState().addNode("activity-end");

    const state = useDiagramStore.getState();
    expect(state.diagramType).toBe("activity");
    expect(state.nodes.map((node) => node.data.kind)).toEqual([
      "activity-start",
      "activity",
      "activity-decision",
      "activity-end",
    ]);
  });

  it("generates activity source from visual activity nodes", () => {
    const generated = useDiagramStore
      .getState()
      .generateSourceFromVisual({ confirmOverwrite: false });

    expect(generated).toContain("start");
    expect(generated).toContain(":Actividad");
    expect(generated).toContain("if (Decision1) then (si)");
    expect(generated).toContain("stop");
  });

  it("stores validation errors when activity diagram has no start or end", () => {
    useDiagramStore.getState().setDiagramType("activity");
    useDiagramStore.getState().clearCanvas({ confirm: false });
    useDiagramStore.getState().addNode("activity");
    useDiagramStore.getState().generateSourceFromVisual({ confirmOverwrite: false });

    expect(useDiagramStore.getState().errors).toEqual([
      "El diagrama de actividades necesita un nodo de inicio.",
      "El diagrama de actividades necesita un nodo de fin.",
    ]);
  });
});
