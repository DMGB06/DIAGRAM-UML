import { describe, expect, it } from "vitest";

import { useDiagramStore } from "../../src/store/useDiagramStore";

describe("useDiagramStore phase 9 sync status", () => {
  it("starts synced after a new project", () => {
    useDiagramStore.getState().newProject({ confirm: false });
    expect(useDiagramStore.getState().syncStatus).toBe("synced");
  });

  it("marks codeDirty when the source text changes", () => {
    useDiagramStore.getState().newProject({ confirm: false });
    useDiagramStore.getState().setSource("@startuml\nclass A\n@enduml");
    expect(useDiagramStore.getState().syncStatus).toBe("codeDirty");
  });

  it("marks visualDirty when a node is added", () => {
    useDiagramStore.getState().newProject({ confirm: false });
    useDiagramStore.getState().addNode("class");
    expect(useDiagramStore.getState().syncStatus).toBe("visualDirty");
  });

  it("marks visualDirty when a node moves", () => {
    useDiagramStore.getState().newProject({ confirm: false });
    useDiagramStore.getState().addNode("class");
    const node = useDiagramStore.getState().nodes[0];
    useDiagramStore.getState().updateNodePosition(node.id, { x: 10, y: 10 });
    expect(useDiagramStore.getState().syncStatus).toBe("visualDirty");
  });

  it("returns to synced after applying code to the canvas", () => {
    useDiagramStore.getState().newProject({ confirm: false });
    useDiagramStore.getState().setSource("@startuml\nclass A\n@enduml");
    expect(useDiagramStore.getState().syncStatus).toBe("codeDirty");

    useDiagramStore.getState().generateFromSource();
    expect(useDiagramStore.getState().syncStatus).toBe("synced");
  });

  it("returns to synced after applying the canvas to the code", () => {
    useDiagramStore.getState().newProject({ confirm: false });
    useDiagramStore.getState().addNode("class");
    expect(useDiagramStore.getState().syncStatus).toBe("visualDirty");

    useDiagramStore.getState().generateSourceFromVisual({ confirmOverwrite: false });
    expect(useDiagramStore.getState().syncStatus).toBe("synced");
  });

  it("switches diagramType automatically when the code matches a known type", () => {
    useDiagramStore.getState().newProject({ confirm: false });
    expect(useDiagramStore.getState().diagramType).toBe("class");

    useDiagramStore.getState().setSource('@startuml\nparticipant "Cliente" as Cliente\n@enduml');

    expect(useDiagramStore.getState().diagramType).toBe("sequence");
  });

  it("keeps the current diagramType when the code is ambiguous or empty", () => {
    useDiagramStore.getState().newProject({ confirm: false });
    useDiagramStore.getState().setSource("@startuml\n@enduml");

    expect(useDiagramStore.getState().diagramType).toBe("class");
  });

  it("keeps a manually moved node position when the source is reparsed", () => {
    useDiagramStore.getState().newProject({ confirm: false });
    useDiagramStore.getState().setSource("@startuml\nclass Usuario\nclass Pedido\n@enduml");
    useDiagramStore.getState().generateFromSource();

    const usuario = useDiagramStore.getState().nodes.find((node) => node.id === "Usuario");
    expect(usuario).toBeDefined();

    useDiagramStore.getState().updateNodePosition(usuario!.id, { x: 999, y: 777 });
    useDiagramStore.getState().generateFromSource();

    const usuarioAfter = useDiagramStore.getState().nodes.find((node) => node.id === "Usuario");
    expect(usuarioAfter?.position).toEqual({ x: 999, y: 777 });
  });

  it("still positions a newly added class when the source grows", () => {
    useDiagramStore.getState().newProject({ confirm: false });
    useDiagramStore.getState().setSource("@startuml\nclass Usuario\n@enduml");
    useDiagramStore.getState().generateFromSource();

    useDiagramStore.getState().setSource("@startuml\nclass Usuario\nclass Pedido\n@enduml");
    useDiagramStore.getState().generateFromSource();

    const pedido = useDiagramStore.getState().nodes.find((node) => node.id === "Pedido");
    expect(pedido?.position).toBeDefined();
  });

  it("does not auto-switch away from usecase when the code looks like sequence syntax", () => {
    useDiagramStore.getState().setDiagramType("usecase");
    expect(useDiagramStore.getState().diagramType).toBe("usecase");

    useDiagramStore.getState().setSource("@startuml\nCliente -> Comprar\n@enduml");

    expect(useDiagramStore.getState().diagramType).toBe("usecase");
  });

  it("still auto-switches from class to sequence when the code matches sequence syntax", () => {
    useDiagramStore.getState().setDiagramType("class");
    expect(useDiagramStore.getState().diagramType).toBe("class");

    useDiagramStore
      .getState()
      .setSource('@startuml\nparticipant "Cliente" as Cliente\n@enduml');

    expect(useDiagramStore.getState().diagramType).toBe("sequence");
  });

  it("marks visualDirty when updateSelectedEdgeMessageKind changes an edge", () => {
    useDiagramStore.getState().setDiagramType("sequence");
    expect(useDiagramStore.getState().syncStatus).toBe("synced");

    const edge = useDiagramStore.getState().edges[0];
    expect(edge).toBeDefined();

    useDiagramStore.getState().selectEdge(edge.id);
    useDiagramStore.getState().updateSelectedEdgeMessageKind("response");

    expect(useDiagramStore.getState().syncStatus).toBe("visualDirty");
  });

  it("returns syncStatus to synced after importing a project, even if it was visualDirty before", () => {
    useDiagramStore.getState().newProject({ confirm: false });
    useDiagramStore.getState().addNode("class");
    expect(useDiagramStore.getState().syncStatus).toBe("visualDirty");

    const json = JSON.stringify({
      version: 1,
      name: "Proyecto UML",
      source: "@startuml\nclass Cliente\n@enduml",
      canvasBackground: "light",
      nodes: [],
      edges: [],
    });

    const project = useDiagramStore.getState().importProjectJson(json);

    expect(project).toBeDefined();
    expect(useDiagramStore.getState().syncStatus).toBe("synced");
  });
});
