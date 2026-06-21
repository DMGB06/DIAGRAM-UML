import { BaseEdge, type EdgeProps } from "@xyflow/react";

import type { DiagramEdgeData } from "../../../diagram/types";

export function EditableEdge({
  sourceX,
  sourceY,
  targetX,
  targetY,
  markerStart,
  markerEnd,
  selected,
  data,
}: EdgeProps) {
  const edgeData = data as DiagramEdgeData | undefined;
  const lineStyle = edgeData?.lineStyle ?? "curve";
  const curveOffset = edgeData?.curveOffset ?? 0;
  const path = getEditablePath(sourceX, sourceY, targetX, targetY, lineStyle, curveOffset);

  return (
    <BaseEdge
      path={path}
      markerStart={markerStart}
      markerEnd={markerEnd}
      interactionWidth={28}
      style={{
        stroke: selected ? "#06b6d4" : "#64748b",
        strokeWidth: selected ? 3 : 2,
      }}
    />
  );
}

function getEditablePath(
  sourceX: number,
  sourceY: number,
  targetX: number,
  targetY: number,
  lineStyle: DiagramEdgeData["lineStyle"],
  curveOffset: number,
) {
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
