import type { DiagramType } from "./types";

export interface DiagramAccent {
  accent: string;
  accentSoft: string;
}

const ACCENT_BY_TYPE: Record<DiagramType, DiagramAccent> = {
  class: { accent: "var(--class-accent)", accentSoft: "var(--class-accent-soft)" },
  sequence: { accent: "var(--sequence-accent)", accentSoft: "var(--sequence-accent-soft)" },
  usecase: { accent: "var(--usecase-accent)", accentSoft: "var(--usecase-accent-soft)" },
  activity: { accent: "var(--activity-accent)", accentSoft: "var(--activity-accent-soft)" },
};

export function getDiagramAccent(diagramType: DiagramType): DiagramAccent {
  return ACCENT_BY_TYPE[diagramType];
}
