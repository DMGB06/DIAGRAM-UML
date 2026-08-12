import type { DiagramNodeStyle } from "./types";

export const ELEMENT_PALETTE = {
  class: { fill: "#ffffff", stroke: "#3559e8", text: "#14161b" },
  sequence: { fill: "#ffffff", stroke: "#e2542b", text: "#14161b" },
  usecase: { fill: "#ffffff", stroke: "#c98a2b", text: "#14161b" },
  activity: { fill: "#ffffff", stroke: "#1e9e7c", text: "#14161b" },
  note: { fill: "#fbf1e1", stroke: "#c98a2b", text: "#14161b" },
  terminal: { fill: "#14161b", stroke: "#14161b", text: "#ffffff" },
  neutral: { fill: "#ffffff", stroke: "#6c7280", text: "#14161b" },
} as const satisfies Record<string, DiagramNodeStyle>;
