import { describe, expect, it } from "vitest";

import { toPlantUmlSequence } from "../../src/diagram/generators/toPlantUmlSequence";
import { parseSequenceDiagram } from "../../src/diagram/parser/parseSequenceDiagram";

describe("sequence diagram support", () => {
  it("parses participants and ordered messages", () => {
    const result = parseSequenceDiagram(`@startuml
participant "Cliente" as Cliente
participant "Sistema" as Sistema
Cliente -> Sistema: Solicitar acceso
Sistema -->> Cliente: Respuesta
@enduml`);

    expect(result.nodes.map((node) => node.data.kind)).toEqual(["participant", "participant"]);
    expect(result.edges.map((edge) => edge.data.order)).toEqual([1, 2]);
    expect(result.edges[1].data.messageKind).toBe("response");
  });

  it("generates sequence PlantUML in message order", () => {
    const result = parseSequenceDiagram(`@startuml
participant "Cliente" as Cliente
participant "Sistema" as Sistema
Sistema -->> Cliente: Respuesta
Cliente -> Sistema: Solicitar acceso
@enduml`);

    const uml = toPlantUmlSequence(result.nodes, result.edges);

    expect(uml).toContain('participant "Cliente" as Cliente');
    expect(uml).toContain("Sistema -->> Cliente: Respuesta");
    expect(uml).toContain("Cliente -> Sistema: Solicitar acceso");
  });
});
