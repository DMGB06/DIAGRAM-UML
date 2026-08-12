import { useReactFlow, useStore } from "@xyflow/react";
import {
  AlignHorizontalJustifyCenter,
  AlignVerticalJustifyCenter,
  ClipboardPaste,
  Copy,
  CopyPlus,
  Redo2,
  StretchHorizontal,
  Trash2,
  Undo2,
} from "lucide-react";

import { useDiagramStore } from "../../store/useDiagramStore";

export function SelectionToolbar() {
  const { getNodesBounds, flowToScreenPosition } = useReactFlow();
  // Subscribing to the viewport forces a re-render on pan/zoom so the
  // position below (derived from flowToScreenPosition) stays in sync.
  const _transform = useStore((state) => state.transform);
  const selectedNodeIds = useDiagramStore((state) => state.selectedNodeIds);
  const undo = useDiagramStore((state) => state.undo);
  const redo = useDiagramStore((state) => state.redo);
  const copySelectedNodes = useDiagramStore((state) => state.copySelectedNodes);
  const pasteNodes = useDiagramStore((state) => state.pasteNodes);
  const duplicateSelectedNodes = useDiagramStore((state) => state.duplicateSelectedNodes);
  const alignSelectedNodes = useDiagramStore((state) => state.alignSelectedNodes);
  const distributeSelectedNodes = useDiagramStore((state) => state.distributeSelectedNodes);
  const deleteSelected = useDiagramStore((state) => state.deleteSelected);

  if (selectedNodeIds.length === 0) {
    return null;
  }

  const bounds = getNodesBounds(selectedNodeIds);
  const topCenterFlow = { x: bounds.x + bounds.width / 2, y: bounds.y };
  const screenPosition = flowToScreenPosition(topCenterFlow);
  const top = Math.max(8, screenPosition.y - 48);

  return (
    <div
      className="selection-toolbar"
      style={{ top, left: screenPosition.x, transform: "translateX(-50%)" }}
    >
      <button type="button" onClick={undo} title="Deshacer">
        <Undo2 size={14} />
      </button>
      <button type="button" onClick={redo} title="Rehacer">
        <Redo2 size={14} />
      </button>
      <div className="selection-toolbar-divider" />
      <button type="button" onClick={copySelectedNodes} title="Copiar">
        <Copy size={14} />
      </button>
      <button type="button" onClick={pasteNodes} title="Pegar">
        <ClipboardPaste size={14} />
      </button>
      <button type="button" onClick={duplicateSelectedNodes} title="Duplicar">
        <CopyPlus size={14} />
      </button>
      <div className="selection-toolbar-divider" />
      <button
        type="button"
        onClick={() => alignSelectedNodes("horizontal")}
        title="Alinear horizontal"
      >
        <AlignHorizontalJustifyCenter size={14} />
      </button>
      <button
        type="button"
        onClick={() => alignSelectedNodes("vertical")}
        title="Alinear vertical"
      >
        <AlignVerticalJustifyCenter size={14} />
      </button>
      <button
        type="button"
        onClick={() => distributeSelectedNodes("horizontal")}
        title="Distribuir"
      >
        <StretchHorizontal size={14} />
      </button>
      <div className="selection-toolbar-divider" />
      <button type="button" className="danger" onClick={deleteSelected} title="Eliminar">
        <Trash2 size={14} />
      </button>
    </div>
  );
}
