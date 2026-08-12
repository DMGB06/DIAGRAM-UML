import { Handle, Position, type Node, type NodeProps } from "@xyflow/react";

import type { DiagramNodeData } from "../../../diagram/types";

export function DecisionNode({ data, selected }: NodeProps<Node<DiagramNodeData>>) {
  return (
    <div className={`relative size-32 ${data.isEditingEdge ? "is-editing-edge" : ""}`}>
      <DecisionHandles />
      <div
        className="absolute inset-4 rotate-45 border shadow-sm"
        style={{
          background: data.style.fill,
          borderColor: selected ? "#06b6d4" : data.style.stroke,
        }}
      />
      <div
        className="absolute inset-0 flex items-center justify-center px-5 text-center text-xs font-semibold"
        style={{ color: data.style.text }}
      >
        {data.label}
      </div>
    </div>
  );
}

function DecisionHandles() {
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
