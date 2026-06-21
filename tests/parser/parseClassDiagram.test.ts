import { describe, expect, it } from "vitest";

import { parseClassDiagram } from "../../src/diagram/parser/parseClassDiagram";

describe("parseClassDiagram", () => {
  it("parses classes and associations", () => {
    const result = parseClassDiagram(`@startuml
class Usuario
class Pedido
Usuario --> Pedido
@enduml`);

    expect(result.nodes).toHaveLength(2);
    expect(result.edges).toHaveLength(1);
    expect(result.errors).toHaveLength(0);
  });
});
