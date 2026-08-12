import { BaseEdge, EdgeLabelRenderer, type EdgeProps } from "@xyflow/react";

import { computeEdgeGeometry } from "../../../diagram/edgeGeometry";
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
  const { path, labelX, labelY } = computeEdgeGeometry(
    sourceX,
    sourceY,
    targetX,
    targetY,
    lineStyle,
    curveOffset,
  );

  return (
    <>
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
      {edgeData?.label && (
        <EdgeLabelRenderer>
          <div
            style={{
              position: "absolute",
              transform: `translate(-50%, -50%) translate(${labelX}px, ${labelY}px)`,
              pointerEvents: "none",
            }}
            className="rounded border border-slate-700 bg-slate-900/90 px-1.5 py-0.5 text-xs text-slate-100"
          >
            {edgeData.label}
          </div>
        </EdgeLabelRenderer>
      )}
    </>
  );
}
