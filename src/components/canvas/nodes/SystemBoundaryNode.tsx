import { Handle, Position, type Node, type NodeProps } from "@xyflow/react";

import type { DiagramNodeData } from "../../../diagram/types";

export function SystemBoundaryNode({ data, selected }: NodeProps<Node<DiagramNodeData>>) {
  return (
    <div
      className={`min-h-52 min-w-72 rounded border-2 border-dashed bg-white/30 p-3 text-sm font-semibold shadow-sm ${
        data.isEditingEdge ? "is-editing-edge" : ""
      }`}
      style={{
        borderColor: selected ? "var(--accent)" : data.style.stroke,
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
