import { Handle, Position, type Node, type NodeProps } from "@xyflow/react";

import type { DiagramNodeData } from "../../../diagram/types";

export function ClassNode({ data, selected }: NodeProps<Node<DiagramNodeData>>) {
  return (
    <div
      className={`min-w-44 overflow-hidden rounded border bg-white text-slate-950 shadow-sm ${
        data.isEditingEdge ? "is-editing-edge" : ""
      }`}
      style={{
        background: data.style.fill,
        borderColor: selected ? "#06b6d4" : data.style.stroke,
        color: data.style.text,
      }}
    >
      <ConnectionHandles />
      <div className="border-b px-3 py-2 text-center text-sm font-semibold">
        {data.kind === "interface" ? `<<${data.kind}>> ` : ""}
        {data.label}
      </div>
      <div className="px-3 py-2 text-xs text-slate-600">+ atributo: tipo</div>
      <div className="border-t px-3 py-2 text-xs text-slate-600">+ metodo(): void</div>
    </div>
  );
}

function ConnectionHandles() {
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
