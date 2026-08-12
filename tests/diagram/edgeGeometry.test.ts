import { describe, expect, it } from "vitest";

import { computeEdgeGeometry, getEditablePath } from "../../src/diagram/edgeGeometry";
import { SEQUENCE_HEADER_OFFSET, SEQUENCE_ROW_HEIGHT } from "../../src/diagram/sequenceLayout";

describe("getEditablePath", () => {
  it("draws a straight line", () => {
    expect(getEditablePath(0, 0, 100, 50, "straight", 0)).toBe("M 0,0 L 100,50");
  });

  it("draws a right-angle step", () => {
    expect(getEditablePath(0, 0, 100, 50, "step", 0)).toBe("M 0,0 L 50,0 L 50,50 L 100,50");
  });

  it("draws a curve through the midpoint when curveOffset is 0", () => {
    expect(getEditablePath(0, 0, 100, 0, "curve", 0)).toBe("M 0,0 Q 50,0 100,0");
  });
});

describe("computeEdgeGeometry", () => {
  it("positions the label at the midpoint of a straight edge", () => {
    const geometry = computeEdgeGeometry(0, 0, 100, 50, "straight", 0);

    expect(geometry.path).toBe("M 0,0 L 100,50");
    expect(geometry.labelX).toBe(50);
    expect(geometry.labelY).toBe(25);
  });
});

describe("computeEdgeGeometry with a sequence order", () => {
  it("ignores the raw sourceY/targetY and uses the row for that order", () => {
    const geometry = computeEdgeGeometry(0, 999, 200, 999, "straight", 0, 2);
    const expectedY = SEQUENCE_HEADER_OFFSET + SEQUENCE_ROW_HEIGHT;

    expect(geometry.path).toBe(`M 0,${expectedY} L 200,${expectedY}`);
    expect(geometry.labelY).toBe(expectedY);
  });

  it("keeps consecutive orders one row apart", () => {
    const first = computeEdgeGeometry(0, 0, 200, 0, "straight", 0, 1);
    const second = computeEdgeGeometry(0, 0, 200, 0, "straight", 0, 2);

    expect(second.labelY - first.labelY).toBe(SEQUENCE_ROW_HEIGHT);
  });

  it("still uses the real sourceY/targetY when order is not given (class edges)", () => {
    const geometry = computeEdgeGeometry(0, 10, 200, 30, "straight", 0, undefined);

    expect(geometry.labelY).toBe(20);
  });
});
