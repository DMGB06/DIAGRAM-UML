import { describe, expect, it } from "vitest";

import { shouldShowTypeSelector } from "../../src/diagram/typeSelectorVisibility";

describe("shouldShowTypeSelector", () => {
  it("returns false for a class diagram with valid class source", () => {
    const source = "class Usuario\nclass Pedido\nUsuario --> Pedido";
    expect(shouldShowTypeSelector("class", source)).toBe(false);
  });

  it("returns false for a sequence diagram with valid sequence source", () => {
    const source = "participant Usuario\nparticipant Sistema\nUsuario -> Sistema: Login";
    expect(shouldShowTypeSelector("sequence", source)).toBe(false);
  });

  it("returns true for empty source on a class diagram", () => {
    expect(shouldShowTypeSelector("class", "")).toBe(true);
  });

  it("returns true for empty source on a sequence diagram", () => {
    expect(shouldShowTypeSelector("sequence", "")).toBe(true);
  });

  it("returns true for ambiguous source containing both class and participant keywords", () => {
    const source = "class Usuario\nparticipant Sistema";
    expect(shouldShowTypeSelector("class", source)).toBe(true);
    expect(shouldShowTypeSelector("sequence", source)).toBe(true);
  });

  it("returns true for a usecase diagram regardless of source content", () => {
    expect(shouldShowTypeSelector("usecase", "actor Usuario")).toBe(true);
  });

  it("returns true for an activity diagram regardless of source content", () => {
    expect(shouldShowTypeSelector("activity", "start")).toBe(true);
  });
});
