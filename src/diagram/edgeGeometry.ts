import type { DiagramEdgeData } from "./types";

export interface EdgeGeometry {
  path: string;
  labelX: number;
  labelY: number;
}

export function getEditablePath(
  sourceX: number,
  sourceY: number,
  targetX: number,
  targetY: number,
  lineStyle: DiagramEdgeData["lineStyle"],
  curveOffset: number,
): string {
  if (lineStyle === "straight") {
    return `M ${sourceX},${sourceY} L ${targetX},${targetY}`;
  }

  if (lineStyle === "step") {
    const midX = sourceX + (targetX - sourceX) / 2;
    return `M ${sourceX},${sourceY} L ${midX},${sourceY} L ${midX},${targetY} L ${targetX},${targetY}`;
  }

  const dx = targetX - sourceX;
  const dy = targetY - sourceY;
  const length = Math.max(Math.sqrt(dx * dx + dy * dy), 1);
  const normalX = -dy / length;
  const normalY = dx / length;
  const controlX = sourceX + dx / 2 + normalX * curveOffset;
  const controlY = sourceY + dy / 2 + normalY * curveOffset;

  return `M ${sourceX},${sourceY} Q ${controlX},${controlY} ${targetX},${targetY}`;
}

export function computeEdgeGeometry(
  sourceX: number,
  sourceY: number,
  targetX: number,
  targetY: number,
  lineStyle: DiagramEdgeData["lineStyle"],
  curveOffset: number,
): EdgeGeometry {
  return {
    path: getEditablePath(sourceX, sourceY, targetX, targetY, lineStyle, curveOffset),
    labelX: (sourceX + targetX) / 2,
    labelY: (sourceY + targetY) / 2,
  };
}
