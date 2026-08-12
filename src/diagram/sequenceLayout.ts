export const SEQUENCE_HEADER_OFFSET = 64;
export const SEQUENCE_ROW_HEIGHT = 56;

const SEQUENCE_MIN_LIFELINE_HEIGHT = 200;

export function sequenceMessageY(order: number): number {
  return SEQUENCE_HEADER_OFFSET + (order - 1) * SEQUENCE_ROW_HEIGHT;
}

export function maxMessageOrder(edges: Array<{ data?: { order?: number } }>): number {
  return edges.reduce((max, edge) => Math.max(max, edge.data?.order ?? 0), 0);
}

export function sequenceLifelineHeight(maxOrder: number): number {
  if (maxOrder <= 0) {
    return SEQUENCE_MIN_LIFELINE_HEIGHT;
  }

  return sequenceMessageY(maxOrder) + SEQUENCE_ROW_HEIGHT;
}
