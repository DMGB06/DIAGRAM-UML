import { describe, expect, it } from "vitest";

import { toPlantUmlUseCase } from "../../src/diagram/generators/toPlantUmlUseCase";
import { parseUseCaseDiagram } from "../../src/diagram/parser/parseUseCaseDiagram";
import { validateUseCaseDiagram } from "../../src/diagram/validators/validateUseCaseDiagram";

describe("use case diagram support", () => {
  it("parses simple use case PlantUML", () => {
    const result = parseUseCaseDiagram(`@startuml
actor Cliente
usecase "Comprar producto" as Comprar
Cliente --> Comprar
@enduml`);

    expect(result.nodes.map((node) => node.data.kind)).toEqual(["actor", "usecase"]);
    expect(result.edges).toHaveLength(1);
    expect(result.errors).toHaveLength(0);
  });

  it("generates use case PlantUML", () => {
    const parsed = parseUseCaseDiagram(`@startuml
actor Cliente
usecase "Comprar producto" as Comprar
Cliente --> Comprar
@enduml`);
    const uml = toPlantUmlUseCase(parsed.nodes, parsed.edges);

    expect(uml).toContain('actor "Cliente" as Cliente');
    expect(uml).toContain('usecase "Comprar producto" as Comprar');
    expect(uml).toContain("Cliente --> Comprar");
  });

  it("validates missing actor or use case", () => {
    expect(validateUseCaseDiagram([], [])).toEqual([
      "El diagrama de casos de uso necesita al menos un actor.",
      "El diagrama de casos de uso necesita al menos un caso de uso.",
    ]);
  });
});
