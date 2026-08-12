import { Handle, Position, type Node, type NodeProps } from "@xyflow/react";

import type { DiagramNodeData } from "../../../diagram/types";

export function ActorNode({ data, selected }: NodeProps<Node<DiagramNodeData>>) {
  return (
    <div
      className={`relative flex w-28 flex-col items-center gap-1 text-center text-sm font-medium ${
        data.isEditingEdge ? "is-editing-edge" : ""
      }`}
      style={{ color: data.style.text }}
    >
      <UseCaseHandles />
      <div
        className="size-10 rounded-full border-2 bg-white"
        style={{ borderColor: selected ? "var(--accent)" : data.style.stroke }}
      />
      <div className="h-10 w-0 border-l-2" style={{ borderColor: data.style.stroke }} />
      <div
        className="absolute top-14 h-0 w-16 border-t-2"
        style={{ borderColor: data.style.stroke }}
      />
      <div className="flex w-16 justify-between">
        <span className="h-8 border-l-2" style={{ borderColor: data.style.stroke }} />
        <span className="h-8 border-l-2" style={{ borderColor: data.style.stroke }} />
      </div>
      <div className="mt-1">{data.label}</div>
    </div>
  );
}

function UseCaseHandles() {
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
