import { Handle, Position, type Node, type NodeProps } from "@xyflow/react";

import type { DiagramNodeData } from "../../../diagram/types";

export function UseCaseNode({ data, selected }: NodeProps<Node<DiagramNodeData>>) {
  return (
    <div
      className={`flex min-h-20 min-w-48 items-center justify-center rounded-[50%] border px-6 py-4 text-center text-sm font-medium shadow-sm ${
        data.isEditingEdge ? "is-editing-edge" : ""
      }`}
      style={{
        background: data.style.fill,
        borderColor: selected ? "#06b6d4" : data.style.stroke,
        color: data.style.text,
      }}
    >
      <Handles />
      {data.label}
    </div>
  );
}

function Handles() {
  return (
    <>
      <Handle id="left-target" type="target" position={Position.Left} className="uml-handle" />
      <Handle id="right-target" type="target" position={Position.Right} className="uml-handle" />
      <Handle id="top-target" type="target" position={Position.Top} className="uml-handle" />
      <Handle id="bottom-target" type="target" position={Position.Bottom} className="uml-handle" />
      <Handle id="left-source" type="source" position={Position.Left} className="uml-handle" />
      <Handle id="right-source" type="source" position={Position.Right} className="uml-handle" />
      <Handle id="top-source" type="source" position={Position.Top} className="uml-handle" />
      <Handle id="bottom-source" type="source" position={Position.Bottom} className="uml-handle" />
    </>
  );
}
