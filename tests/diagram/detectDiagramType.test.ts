import { describe, expect, it } from "vitest";

import { detectDiagramType } from "../../src/diagram/detectDiagramType";

describe("detectDiagramType", () => {
  it("detects class diagrams from the class keyword", () => {
    expect(detectDiagramType("@startuml\nclass Usuario\n@enduml")).toBe("class");
  });

  it("detects class diagrams from the interface keyword", () => {
    expect(detectDiagramType("@startuml\ninterface Repo\n@enduml")).toBe("class");
  });

  it("detects class diagrams from the enum keyword", () => {
    expect(detectDiagramType("@startuml\nenum Estado\n@enduml")).toBe("class");
  });

  it("detects class diagrams from an inheritance arrow with no keyword", () => {
    expect(detectDiagramType("@startuml\nA --|> B\n@enduml")).toBe("class");
  });

  it("detects sequence diagrams from the participant keyword", () => {
    expect(detectDiagramType('@startuml\nparticipant "Cliente" as Cliente\n@enduml')).toBe(
      "sequence",
    );
  });

  it("detects sequence diagrams from a single-dash message arrow with no keyword", () => {
    expect(detectDiagramType("@startuml\nCliente -> Sistema: Solicitar acceso\n@enduml")).toBe(
      "sequence",
    );
  });

  it("detects sequence diagrams from a response arrow with no keyword", () => {
    expect(detectDiagramType("@startuml\nSistema -->> Cliente: Respuesta\n@enduml")).toBe(
      "sequence",
    );
  });

  it("detects sequence diagrams from the full registry template", () => {
    const source =
      '@startuml\nparticipant "Cliente" as Cliente\nparticipant "Sistema" as Sistema\n' +
      "Cliente -> Sistema: Solicitar acceso\nSistema -->> Cliente: Respuesta\n@enduml";

    expect(detectDiagramType(source)).toBe("sequence");
  });

  it("returns null for empty source", () => {
    expect(detectDiagramType("@startuml\n@enduml")).toBeNull();
  });

  it("returns null for ambiguous source with no class or sequence signals", () => {
    expect(detectDiagramType("@startuml\nactor Cliente\nA --> B\n@enduml")).toBeNull();
  });
});
