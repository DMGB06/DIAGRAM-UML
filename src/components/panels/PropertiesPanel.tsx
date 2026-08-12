import { ArrowDown, ArrowLeftRight, ArrowUp, Moon, Palette, Sun, Trash2 } from "lucide-react";

import { useDiagramStore } from "../../store/useDiagramStore";
import type { EdgeSide } from "../../diagram/types";

const colors = [
  "#eaeffd",
  "#fcebe6",
  "#fbf1e1",
  "#e4f6f1",
  "#ffffff",
  "#f8f9fa",
];
const strokeColors = [
  "#3559e8",
  "#e2542b",
  "#c98a2b",
  "#1e9e7c",
  "#6c7280",
  "#14161b",
];
const textColors = [
  "#14161b",
  "#6c7280",
  "#3559e8",
  "#e2542b",
  "#c98a2b",
  "#ffffff",
];
const edgeSides: Array<{ value: EdgeSide; label: string }> = [
  { value: "left", label: "Izq." },
  { value: "right", label: "Der." },
  { value: "top", label: "Arriba" },
  { value: "bottom", label: "Abajo" },
];

export function PropertiesPanel() {
  const nodes = useDiagramStore((state) => state.nodes);
  const edges = useDiagramStore((state) => state.edges);
  const selectedNodeId = useDiagramStore((state) => state.selectedNodeId);
  const selectedEdgeId = useDiagramStore((state) => state.selectedEdgeId);
  const canvasBackground = useDiagramStore((state) => state.canvasBackground);
  const projectError = useDiagramStore((state) => state.projectError);
  const deleteSelected = useDiagramStore((state) => state.deleteSelected);
  const updateSelectedNodeLabel = useDiagramStore((state) => state.updateSelectedNodeLabel);
  const updateSelectedNodeColor = useDiagramStore((state) => state.updateSelectedNodeColor);
  const updateSelectedNodeStroke = useDiagramStore((state) => state.updateSelectedNodeStroke);
  const updateSelectedNodeTextColor = useDiagramStore((state) => state.updateSelectedNodeTextColor);
  const reverseSelectedEdge = useDiagramStore((state) => state.reverseSelectedEdge);
  const updateSelectedEdgeType = useDiagramStore((state) => state.updateSelectedEdgeType);
  const updateSelectedEdgeCurve = useDiagramStore((state) => state.updateSelectedEdgeCurve);
  const updateSelectedEdgeLabel = useDiagramStore((state) => state.updateSelectedEdgeLabel);
  const updateSelectedEdgeMessageKind = useDiagramStore(
    (state) => state.updateSelectedEdgeMessageKind,
  );
  const moveSelectedEdgeOrder = useDiagramStore((state) => state.moveSelectedEdgeOrder);
  const updateSelectedEdgeConnectionSide = useDiagramStore(
    (state) => state.updateSelectedEdgeConnectionSide,
  );
  const setCanvasBackground = useDiagramStore((state) => state.setCanvasBackground);
  const selectedNode = nodes.find((node) => node.id === selectedNodeId);
  const selectedEdge = edges.find((edge) => edge.id === selectedEdgeId);

  return (
    <div className="h-full overflow-y-auto p-4">
      <div className="flex items-center gap-2">
        <Palette size={18} className="text-[var(--accent)]" />
        <h2 className="text-sm font-semibold text-[var(--ink)]">Propiedades</h2>
      </div>

      {projectError && (
        <div className="mt-4 rounded border border-[var(--danger)]/40 bg-[var(--danger-soft)] p-3 text-xs text-[var(--danger)]">
          {projectError}
        </div>
      )}

      <div className="mt-5">
        <label className="text-xs font-medium text-[var(--graphite)]">Fondo del lienzo</label>
        <div className="mt-2 grid grid-cols-2 gap-2">
          <button
            className={`toolbar-button justify-center ${
              canvasBackground === "dark" ? "border-[var(--accent)] text-[var(--accent)]" : ""
            }`}
            type="button"
            onClick={() => setCanvasBackground("dark")}
          >
            <Moon size={15} />
            Oscuro
          </button>
          <button
            className={`toolbar-button justify-center ${
              canvasBackground === "light" ? "border-[var(--accent)] text-[var(--accent)]" : ""
            }`}
            type="button"
            onClick={() => setCanvasBackground("light")}
          >
            <Sun size={15} />
            Blanco
          </button>
        </div>
      </div>

      {!selectedNode && !selectedEdge && (
        <p className="mt-4 text-sm text-[var(--graphite)]">
          Selecciona una clase o una flecha del lienzo para editar sus propiedades.
        </p>
      )}

      {selectedNode && (
        <div className="mt-5 space-y-5">
          <div>
            <label className="text-xs font-medium text-[var(--graphite)]">Elemento</label>
            <input
              className="mt-2 w-full rounded border border-[var(--line)] bg-[var(--surface)] px-3 py-2 text-sm text-[var(--ink)] outline-none focus:border-[var(--accent)]"
              value={selectedNode.data.label}
              onChange={(event) => updateSelectedNodeLabel(event.target.value)}
            />
            <p className="mt-2 text-xs text-[var(--graphite)]">Tipo: {selectedNode.data.kind}</p>
          </div>

          <div>
            <label className="text-xs font-medium text-[var(--graphite)]">Color de fondo</label>
            <div className="mt-2 grid grid-cols-6 gap-2">
              {colors.map((color) => (
                <button
                  key={color}
                  type="button"
                  className="size-8 rounded border border-[var(--line)]"
                  style={{ background: color }}
                  title={color}
                  onClick={() => updateSelectedNodeColor(color)}
                />
              ))}
            </div>
          </div>

          <div>
            <label className="text-xs font-medium text-[var(--graphite)]">Color de borde</label>
            <div className="mt-2 grid grid-cols-6 gap-2">
              {strokeColors.map((color) => (
                <button
                  key={color}
                  type="button"
                  className="size-8 rounded border border-[var(--line)]"
                  style={{ background: color }}
                  title={color}
                  onClick={() => updateSelectedNodeStroke(color)}
                />
              ))}
            </div>
          </div>

          <div>
            <label className="text-xs font-medium text-[var(--graphite)]">Color de texto</label>
            <div className="mt-2 grid grid-cols-6 gap-2">
              {textColors.map((color) => (
                <button
                  key={color}
                  type="button"
                  className="size-8 rounded border border-[var(--line)]"
                  style={{ background: color }}
                  title={color}
                  onClick={() => updateSelectedNodeTextColor(color)}
                />
              ))}
            </div>
          </div>

          <div>
            <label className="text-xs font-medium text-[var(--graphite)]">Posicion</label>
            <div className="mt-2 grid grid-cols-2 gap-2 text-xs text-[var(--ink)]">
              <div className="rounded border border-[var(--line)] bg-[var(--paper)] px-2 py-2">
                X: {Math.round(selectedNode.position.x)}
              </div>
              <div className="rounded border border-[var(--line)] bg-[var(--paper)] px-2 py-2">
                Y: {Math.round(selectedNode.position.y)}
              </div>
            </div>
          </div>

          <button
            className="toolbar-button w-full justify-center border-[var(--danger)]/50 text-[var(--danger)] hover:bg-[var(--danger-soft)]"
            type="button"
            onClick={deleteSelected}
          >
            <Trash2 size={16} />
            Eliminar nodo
          </button>
        </div>
      )}

      {selectedEdge && (
        <div className="mt-5 space-y-5">
          <div>
            <label className="text-xs font-medium text-[var(--graphite)]">Flecha seleccionada</label>
            <div className="mt-2 rounded border border-[var(--line)] bg-[var(--paper)] px-3 py-2 text-sm text-[var(--ink)]">
              {selectedEdge.source} hacia {selectedEdge.target}
              <span className="mt-1 block text-xs text-[var(--graphite)]">
                Punta: {selectedEdge.data?.arrowDirection === "reverse" ? "origen" : "destino"}
              </span>
            </div>
          </div>

          <div>
            <label className="text-xs font-medium text-[var(--graphite)]">Texto del mensaje</label>
            <input
              className="mt-2 w-full rounded border border-[var(--line)] bg-[var(--surface)] px-3 py-2 text-sm text-[var(--ink)] outline-none focus:border-[var(--accent)]"
              value={selectedEdge.data?.label ?? ""}
              onChange={(event) => updateSelectedEdgeLabel(event.target.value)}
            />
          </div>

          {selectedEdge.data?.order !== undefined && (
            <div>
              <label className="text-xs font-medium text-[var(--graphite)]">Orden del mensaje</label>
              <div className="mt-2 grid grid-cols-2 gap-2">
                <button
                  className="toolbar-button justify-center"
                  type="button"
                  onClick={() => moveSelectedEdgeOrder("up")}
                >
                  <ArrowUp size={16} />
                  Subir
                </button>
                <button
                  className="toolbar-button justify-center"
                  type="button"
                  onClick={() => moveSelectedEdgeOrder("down")}
                >
                  <ArrowDown size={16} />
                  Bajar
                </button>
              </div>
            </div>
          )}

          {selectedEdge.data?.messageKind && (
            <div>
              <label className="text-xs font-medium text-[var(--graphite)]">Tipo de mensaje</label>
              <div className="mt-2 grid grid-cols-2 gap-2">
                <button
                  className={`toolbar-button justify-center ${
                    selectedEdge.data.messageKind === "message"
                      ? "border-[var(--accent)] text-[var(--accent)]"
                      : ""
                  }`}
                  type="button"
                  onClick={() => updateSelectedEdgeMessageKind("message")}
                >
                  Mensaje
                </button>
                <button
                  className={`toolbar-button justify-center ${
                    selectedEdge.data.messageKind === "response"
                      ? "border-[var(--accent)] text-[var(--accent)]"
                      : ""
                  }`}
                  type="button"
                  onClick={() => updateSelectedEdgeMessageKind("response")}
                >
                  Respuesta
                </button>
              </div>
            </div>
          )}

          <button
            className="toolbar-button w-full justify-center"
            type="button"
            onClick={reverseSelectedEdge}
          >
            <ArrowLeftRight size={16} />
            Invertir direccion
          </button>

          <button
            className="toolbar-button w-full justify-center border-[var(--danger)]/50 text-[var(--danger)] hover:bg-[var(--danger-soft)]"
            type="button"
            onClick={deleteSelected}
          >
            <Trash2 size={16} />
            Eliminar flecha
          </button>

          <div>
            <label className="text-xs font-medium text-[var(--graphite)]">Punto de salida</label>
            <div className="mt-2 grid grid-cols-2 gap-2">
              {edgeSides.map((side) => (
                <button
                  key={`source-${side.value}`}
                  className={`toolbar-button justify-center ${
                    selectedEdge.sourceHandle === `${side.value}-source`
                      ? "border-[var(--accent)] text-[var(--accent)]"
                      : ""
                  }`}
                  type="button"
                  onClick={() => updateSelectedEdgeConnectionSide("source", side.value)}
                >
                  {side.label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="text-xs font-medium text-[var(--graphite)]">Punto de entrada</label>
            <div className="mt-2 grid grid-cols-2 gap-2">
              {edgeSides.map((side) => (
                <button
                  key={`target-${side.value}`}
                  className={`toolbar-button justify-center ${
                    selectedEdge.targetHandle === `${side.value}-target`
                      ? "border-[var(--accent)] text-[var(--accent)]"
                      : ""
                  }`}
                  type="button"
                  onClick={() => updateSelectedEdgeConnectionSide("target", side.value)}
                >
                  {side.label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="text-xs font-medium text-[var(--graphite)]">Diseno de flecha</label>
            <div className="mt-2 grid gap-2">
              {(["curve", "straight", "step"] as const).map((type) => (
                <button
                  key={type}
                  className={`toolbar-button justify-center ${
                    selectedEdge.data?.lineStyle === type
                      ? "border-[var(--accent)] text-[var(--accent)]"
                      : ""
                  }`}
                  type="button"
                  onClick={() => updateSelectedEdgeType(type)}
                >
                  {type === "curve" ? "Curva" : type === "straight" ? "Recta" : "Escalonada"}
                </button>
              ))}
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between">
              <label className="text-xs font-medium text-[var(--graphite)]">Curvatura manual</label>
              <span className="text-xs text-[var(--graphite)]">
                {selectedEdge.data?.curveOffset ?? 0}
              </span>
            </div>
            <input
              className="mt-3 w-full accent-[var(--accent)]"
              type="range"
              min="-180"
              max="180"
              step="10"
              value={selectedEdge.data?.curveOffset ?? 0}
              onChange={(event) => updateSelectedEdgeCurve(Number(event.target.value))}
            />
            <div className="mt-2 grid grid-cols-3 gap-2">
              <button
                className="toolbar-button justify-center"
                type="button"
                onClick={() => updateSelectedEdgeCurve(-90)}
              >
                Izq.
              </button>
              <button
                className="toolbar-button justify-center"
                type="button"
                onClick={() => updateSelectedEdgeCurve(0)}
              >
                Centro
              </button>
              <button
                className="toolbar-button justify-center"
                type="button"
                onClick={() => updateSelectedEdgeCurve(90)}
              >
                Der.
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
