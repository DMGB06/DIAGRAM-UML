import { describe, expect, it } from "vitest";

import { mergeNodePositions } from "../../src/diagram/mergeLayout";

describe("mergeNodePositions", () => {
  it("keeps the previous position for a node that already existed", () => {
    const previous = [
      { id: "a", type: "umlClass", position: { x: 500, y: 500 }, data: { label: "A" } },
    ];
    const parsed = [
      { id: "a", type: "umlClass", position: { x: 80, y: 80 }, data: { label: "A" } },
    ];

    const merged = mergeNodePositions(previous, parsed);

    expect(merged[0].position).toEqual({ x: 500, y: 500 });
  });

  it("uses the parsed position for a node that did not exist before", () => {
    const parsed = [
      { id: "b", type: "umlClass", position: { x: 80, y: 80 }, data: { label: "B" } },
    ];

    const merged = mergeNodePositions([], parsed);

    expect(merged[0].position).toEqual({ x: 80, y: 80 });
  });

  it("drops nodes that no longer exist in the parsed result", () => {
    const previous = [
      { id: "a", type: "umlClass", position: { x: 500, y: 500 }, data: { label: "A" } },
    ];

    const merged = mergeNodePositions(previous, []);

    expect(merged).toHaveLength(0);
  });

  it("preserves every field of the parsed node except position", () => {
    const previous = [
      { id: "a", type: "umlClass", position: { x: 500, y: 500 }, data: { label: "A" } },
    ];
    const parsed = [
      { id: "a", type: "umlClass", position: { x: 80, y: 80 }, data: { label: "Renamed" } },
    ];

    const merged = mergeNodePositions(previous, parsed);

    expect(merged[0].data.label).toBe("Renamed");
  });
});
