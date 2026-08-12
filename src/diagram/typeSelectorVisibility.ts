import { detectDiagramType } from "./detectDiagramType";
import type { DiagramType } from "./types";

export function shouldShowTypeSelector(diagramType: DiagramType, source: string): boolean {
  if (diagramType !== "class" && diagramType !== "sequence") {
    return true;
  }

  return detectDiagramType(source) === null;
}
