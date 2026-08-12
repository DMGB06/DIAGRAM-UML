import { describe, expect, it } from "vitest";

import {
  diagramDefinitions,
  diagramRegistry,
  getDiagramDefinition,
} from "../../src/diagram/diagramRegistry";
import { useDiagramStore } from "../../src/store/useDiagramStore";

describe("diagramRegistry", () => {
  it("registers every available diagram type with the required contracts", () => {
    expect(diagramDefinitions.map((definition) => definition.type)).toEqual([
      "class",
      "activity",
      "usecase",
      "sequence",
    ]);

    for (const definition of diagramDefinitions) {
      expect(definition.label).toBeTruthy();
      expect(definition.initialSource).toContain("@startuml");
      expect(definition.elements.length).toBeGreaterThan(0);
      expect(definition.parse).toBeTypeOf("function");
      expect(definition.generate).toBeTypeOf("function");
      expect(definition.validate).toBeTypeOf("function");
    }
  });

  it("keeps parser, generator, elements and validations separated by type", () => {
    expect(diagramRegistry.class.elements.map((element) => element.kind)).toContain("class");
    expect(diagramRegistry.activity.elements.map((element) => element.kind)).toContain(
      "activity-start",
    );
    expect(diagramRegistry.usecase.elements.map((element) => element.kind)).toContain("actor");
    expect(diagramRegistry.sequence.elements.map((element) => element.kind)).toContain(
      "participant",
    );

    expect(diagramRegistry.activity.validate([], [])).toContain(
      "El diagrama de actividades necesita un nodo de inicio.",
    );
    expect(diagramRegistry.class.validate([], [])).toEqual([]);
  });

  it("lets the store switch diagram type through the registry initial source", () => {
    useDiagramStore.getState().setDiagramType("sequence");

    expect(useDiagramStore.getState().source).toBe(getDiagramDefinition("sequence").initialSource);
  });
});
