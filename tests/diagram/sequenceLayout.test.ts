import { describe, expect, it } from "vitest";

import {
  maxMessageOrder,
  sequenceLifelineHeight,
  sequenceMessageY,
} from "../../src/diagram/sequenceLayout";

describe("sequenceMessageY", () => {
  it("places the first message at the header offset", () => {
    expect(sequenceMessageY(1)).toBe(140);
  });

  it("spaces messages by the row height", () => {
    expect(sequenceMessageY(2)).toBe(196);
    expect(sequenceMessageY(3)).toBe(252);
  });
});

describe("maxMessageOrder", () => {
  it("returns 0 for no edges", () => {
    expect(maxMessageOrder([])).toBe(0);
  });

  it("returns the highest order value across edges", () => {
    const edges = [{ data: { order: 1 } }, { data: { order: 3 } }, { data: { order: 2 } }];
    expect(maxMessageOrder(edges)).toBe(3);
  });

  it("ignores edges without an order (e.g. class relations)", () => {
    const edges = [{ data: {} }, { data: { order: 2 } }];
    expect(maxMessageOrder(edges)).toBe(2);
  });
});

describe("sequenceLifelineHeight", () => {
  it("returns a sensible minimum height when there are no messages", () => {
    expect(sequenceLifelineHeight(0)).toBe(200);
  });

  it("grows to fit the last message row", () => {
    expect(sequenceLifelineHeight(3)).toBe(sequenceMessageY(3) + 56);
  });
});
