import { describe, expect, it } from "vitest";

import { getDiagramAccent } from "../../src/diagram/diagramAccent";

describe("getDiagramAccent", () => {
  it("returns the class accent for class diagrams", () => {
    expect(getDiagramAccent("class")).toEqual({
      accent: "var(--class-accent)",
      accentSoft: "var(--class-accent-soft)",
    });
  });

  it("returns the sequence accent for sequence diagrams", () => {
    expect(getDiagramAccent("sequence")).toEqual({
      accent: "var(--sequence-accent)",
      accentSoft: "var(--sequence-accent-soft)",
    });
  });

  it("returns the usecase accent for usecase diagrams", () => {
    expect(getDiagramAccent("usecase")).toEqual({
      accent: "var(--usecase-accent)",
      accentSoft: "var(--usecase-accent-soft)",
    });
  });

  it("returns the activity accent for activity diagrams", () => {
    expect(getDiagramAccent("activity")).toEqual({
      accent: "var(--activity-accent)",
      accentSoft: "var(--activity-accent-soft)",
    });
  });
});
