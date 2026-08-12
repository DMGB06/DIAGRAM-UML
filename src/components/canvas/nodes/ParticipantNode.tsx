import { Handle, Position, type Node, type NodeProps } from "@xyflow/react";

import { maxMessageOrder, sequenceLifelineHeight } from "../../../diagram/sequenceLayout";
import type { DiagramNodeData } from "../../../diagram/types";
import { useDiagramStore } from "../../../store/useDiagramStore";

export function ParticipantNode({ data, selected }: NodeProps<Node<DiagramNodeData>>) {
  const lifelineHeight = useDiagramStore((state) =>
    sequenceLifelineHeight(maxMessageOrder(state.edges)),
  );

  return (
    <div
      className={`relative flex flex-col items-center ${data.isEditingEdge ? "is-editing-edge" : ""}`}
    >
      <Handles />
      <div
        className="min-w-36 rounded border bg-white px-4 py-2 text-center text-sm font-semibold shadow-sm"
        style={{
          borderColor: selected ? "var(--accent)" : data.style.stroke,
          color: data.style.text,
        }}
      >
        {data.label}
      </div>
      <div
        className="border-l border-dashed border-[var(--line)]"
        style={{ height: lifelineHeight }}
      />
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
