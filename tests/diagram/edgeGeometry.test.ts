import { describe, expect, it } from "vitest";

import { computeEdgeGeometry, getEditablePath } from "../../src/diagram/edgeGeometry";

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
