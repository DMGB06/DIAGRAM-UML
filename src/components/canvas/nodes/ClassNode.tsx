import { Handle, Position, type Node, type NodeProps } from "@xyflow/react";

import type { DiagramNodeData } from "../../../diagram/types";

export function ClassNode({ data, selected }: NodeProps<Node<DiagramNodeData>>) {
  if (data.kind === "note") {
    return (
      <div
        className={`min-w-40 rounded border px-3 py-3 text-sm shadow-sm ${
          data.isEditingEdge ? "is-editing-edge" : ""
        }`}
        style={{
          background: data.style.fill,
          borderColor: selected ? "var(--accent)" : data.style.stroke,
          color: data.style.text,
        }}
      >
        <ConnectionHandles />
        <div className="whitespace-pre-wrap">{data.label}</div>
      </div>
    );
  }

  return (
    <div
      className={`min-w-44 overflow-hidden rounded border bg-white text-slate-950 shadow-sm ${
        data.isEditingEdge ? "is-editing-edge" : ""
      }`}
      style={{
        background: data.style.fill,
        borderColor: selected ? "var(--accent)" : data.style.stroke,
        color: data.style.text,
      }}
    >
      <ConnectionHandles />
      <div className="border-b px-3 py-2 text-center text-sm font-semibold">
        {data.kind === "interface" ? `<<${data.kind}>> ` : ""}
        {data.kind === "enum" ? `<<${data.kind}>> ` : ""}
        {data.label}
      </div>
      <div className="px-3 py-2 text-xs text-[var(--graphite)]">+ atributo: tipo</div>
      <div className="border-t px-3 py-2 text-xs text-[var(--graphite)]">+ metodo(): void</div>
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
