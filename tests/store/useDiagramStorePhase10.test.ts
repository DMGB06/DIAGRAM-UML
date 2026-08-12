import { describe, expect, it } from "vitest";

import { useDiagramStore } from "../../src/store/useDiagramStore";

describe("useDiagramStore phase 10 sequence handle sides", () => {
  it("gives forward and backward messages between the same pair the same wide-spanning handle sides", () => {
    useDiagramStore.getState().newProject({ confirm: false });
    useDiagramStore.getState().setSource(
      '@startuml\nparticipant "Cliente" as Cliente\nparticipant "Sistema" as Sistema\nCliente -> Sistema: Solicitar\nSistema -->> Cliente: Responder\n@enduml',
    );
    useDiagramStore.getState().generateFromSource();

    const edges = useDiagramStore.getState().edges;
    const forward = edges.find((edge) => edge.source === "Cliente" && edge.target === "Sistema");
    const backward = edges.find((edge) => edge.source === "Sistema" && edge.target === "Cliente");

    expect(forward?.sourceHandle).toBe("left-source");
    expect(forward?.targetHandle).toBe("right-target");
    expect(backward?.sourceHandle).toBe("right-source");
    expect(backward?.targetHandle).toBe("left-target");
  });

  it("keeps the original hardcoded handle sides for class-diagram edges (no order field)", () => {
    useDiagramStore.getState().newProject({ confirm: false });
    useDiagramStore.getState().setSource("@startuml\nclass Usuario\nclass Pedido\nUsuario --> Pedido\n@enduml");
    useDiagramStore.getState().generateFromSource();

    const edge = useDiagramStore.getState().edges[0];
    expect(edge.sourceHandle).toBe("right-source");
    expect(edge.targetHandle).toBe("left-target");
  });

  it("assigns the next sequence message order from the max existing order, not the edge count (survives deletions)", () => {
    useDiagramStore.getState().newProject({ confirm: false });
    useDiagramStore.getState().setSource(
      '@startuml\nparticipant "Cliente" as Cliente\nparticipant "Sistema" as Sistema\nparticipant "Base" as Base\nCliente -> Sistema: Uno\nSistema -> Base: Dos\nBase -> Cliente: Tres\n@enduml',
    );
    useDiagramStore.getState().generateFromSource();

    const messageTwo = useDiagramStore
      .getState()
      .edges.find((edge) => edge.data?.order === 2);
    expect(messageTwo).toBeDefined();

    useDiagramStore.getState().selectEdge(messageTwo!.id);
    useDiagramStore.getState().deleteSelected();

    useDiagramStore.getState().addEdge({
      source: "Cliente",
      target: "Base",
      sourceHandle: "left-source",
      targetHandle: "right-target",
    });

    const orders = useDiagramStore
      .getState()
      .edges.map((edge) => edge.data?.order)
      .sort((a, b) => (a ?? 0) - (b ?? 0));

    expect(orders).toEqual([1, 3, 4]);
  });
});
