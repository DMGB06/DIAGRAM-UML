import { Handle, Position, type Node, type NodeProps } from "@xyflow/react";

import type { DiagramNodeData } from "../../../diagram/types";

export function StartEndNode({ data, selected }: NodeProps<Node<DiagramNodeData>>) {
  return (
    <div
      className={`flex size-20 items-center justify-center rounded-full border text-xs font-semibold shadow-sm ${
        data.isEditingEdge ? "is-editing-edge" : ""
      }`}
      style={{
        background: data.style.fill,
        borderColor: selected ? "var(--accent)" : data.style.stroke,
        color: data.style.text,
      }}
    >
      <TerminalHandles />
      {data.label}
    </div>
  );
}

function TerminalHandles() {
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
