import { describe, expect, it } from "vitest";

import { toPlantUmlActivity } from "../../src/diagram/generators/toPlantUmlActivity";
import { parseActivityDiagram } from "../../src/diagram/parser/parseActivityDiagram";
import { validateActivityDiagram } from "../../src/diagram/validators/validateActivityDiagram";

describe("activity diagram support", () => {
  it("parses simple activity PlantUML", () => {
    const result = parseActivityDiagram(`@startuml
start
:Validar datos;
if (Datos validos?) then (si)
endif
stop
@enduml`);

    expect(result.nodes.map((node) => node.data.kind)).toEqual([
      "activity-start",
      "activity",
      "activity-decision",
      "activity-end",
    ]);
    expect(result.edges).toHaveLength(3);
    expect(result.errors).toHaveLength(0);
  });

  it("generates activity PlantUML from visual nodes", () => {
    const parsed = parseActivityDiagram(`@startuml
start
:Validar datos;
stop
@enduml`);

    const uml = toPlantUmlActivity(parsed.nodes, parsed.edges);

    expect(uml).toContain("start");
    expect(uml).toContain(":Validar datos;");
    expect(uml).toContain("stop");
  });

  it("warns when activity diagram has no start or end", () => {
    const parsed = parseActivityDiagram(`@startuml
:Validar datos;
@enduml`);

    expect(validateActivityDiagram(parsed.nodes)).toEqual([
      "El diagrama de actividades necesita un nodo de inicio.",
      "El diagrama de actividades necesita un nodo de fin.",
    ]);
  });
});
