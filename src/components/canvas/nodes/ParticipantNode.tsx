import { Handle, Position, type Node, type NodeProps } from "@xyflow/react";

import type { DiagramNodeData } from "../../../diagram/types";

export function ParticipantNode({ data, selected }: NodeProps<Node<DiagramNodeData>>) {
  return (
    <div
      className={`relative flex flex-col items-center ${data.isEditingEdge ? "is-editing-edge" : ""}`}
    >
      <Handles />
      <div
        className="min-w-36 rounded border bg-white px-4 py-2 text-center text-sm font-semibold shadow-sm"
        style={{
          borderColor: selected ? "#06b6d4" : data.style.stroke,
          color: data.style.text,
        }}
      >
        {data.label}
      </div>
      <div className="h-[420px] border-l border-dashed border-slate-400" />
    </div>
  );
}

function Handles() {
  return (
    <>
      <Handle id="left-target" type="target" position={Position.Left} className="uml-handle" />
      <Handle id="right-target" type="target" position={Position.Right} className="uml-handle" />
      <Handle id="left-source" type="source" position={Position.Left} className="uml-handle" />
      <Handle id="right-source" type="source" position={Position.Right} className="uml-handle" />
    </>
  );
}
