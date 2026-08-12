import { describe, expect, it } from "vitest";

import { toPlantUml } from "../../src/diagram/generators/toPlantUml";
import { parseClassDiagram } from "../../src/diagram/parser/parseClassDiagram";
import type { ParserResult } from "../../src/diagram/types";

function stripPositions(nodes: ParserResult["nodes"]) {
  return nodes.map(({ position: _position, ...rest }) => rest);
}

function stripIds(edges: ParserResult["edges"]) {
  return edges.map(({ id: _id, ...rest }) => rest);
}

describe("class diagram roundtrip", () => {
  it("preserves classes, an interface, an enum and every relation type through a full roundtrip", () => {
    const source = `@startuml
class Usuario
interface Repositorio
enum Estado
Usuario --|> Repositorio
Usuario ..> Estado : depende
Usuario *-- Estado : contiene
Usuario o-- Repositorio : agrega
Usuario --> Repositorio : usa
@enduml`;

    const firstParse = parseClassDiagram(source);
    const generated = toPlantUml(firstParse.nodes, firstParse.edges);
    const secondParse = parseClassDiagram(generated);

    expect(secondParse.errors).toEqual([]);
    expect(stripPositions(secondParse.nodes)).toEqual(stripPositions(firstParse.nodes));
    expect(stripIds(secondParse.edges)).toEqual(stripIds(firstParse.edges));
  });

  it("preserves a relation with no explicit label through a full roundtrip", () => {
    const source = `@startuml
class Usuario
class Pedido
Usuario --> Pedido
@enduml`;

    const firstParse = parseClassDiagram(source);
    const generated = toPlantUml(firstParse.nodes, firstParse.edges);
    const secondParse = parseClassDiagram(generated);

    expect(secondParse.errors).toEqual([]);
    expect(stripPositions(secondParse.nodes)).toEqual(stripPositions(firstParse.nodes));
    expect(stripIds(secondParse.edges)).toEqual(stripIds(firstParse.edges));
  });
});
