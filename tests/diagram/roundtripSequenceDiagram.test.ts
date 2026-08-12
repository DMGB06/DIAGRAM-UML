import { describe, expect, it } from "vitest";

import { toPlantUmlSequence } from "../../src/diagram/generators/toPlantUmlSequence";
import { parseSequenceDiagram } from "../../src/diagram/parser/parseSequenceDiagram";
import type { ParserResult } from "../../src/diagram/types";

function stripPositions(nodes: ParserResult["nodes"]) {
  return nodes.map(({ position: _position, ...rest }) => rest);
}

function stripIds(edges: ParserResult["edges"]) {
  return edges.map(({ id: _id, ...rest }) => rest);
}

describe("sequence diagram roundtrip", () => {
  it("preserves participants and ordered messages, including responses, through a full roundtrip", () => {
    const source = `@startuml
participant "Cliente" as Cliente
participant "Sistema" as Sistema
participant "Base de datos" as BaseDeDatos
Cliente -> Sistema: Solicitar acceso
Sistema -> BaseDeDatos: Verificar credenciales
BaseDeDatos -->> Sistema: Credenciales validas
Sistema -->> Cliente: Acceso concedido
@enduml`;

    const firstParse = parseSequenceDiagram(source);
    const generated = toPlantUmlSequence(firstParse.nodes, firstParse.edges);
    const secondParse = parseSequenceDiagram(generated);

    expect(secondParse.errors).toEqual([]);
    expect(stripPositions(secondParse.nodes)).toEqual(stripPositions(firstParse.nodes));
    expect(stripIds(secondParse.edges)).toEqual(stripIds(firstParse.edges));
  });

  it("preserves a message with no explicit label through a full roundtrip", () => {
    const source = `@startuml
participant "Cliente" as Cliente
participant "Sistema" as Sistema
Cliente -> Sistema
@enduml`;

    const firstParse = parseSequenceDiagram(source);
    const generated = toPlantUmlSequence(firstParse.nodes, firstParse.edges);
    const secondParse = parseSequenceDiagram(generated);

    expect(secondParse.errors).toEqual([]);
    expect(stripPositions(secondParse.nodes)).toEqual(stripPositions(firstParse.nodes));
    expect(stripIds(secondParse.edges)).toEqual(stripIds(firstParse.edges));
  });
});
