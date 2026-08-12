import { MarkerType, type Connection, type Edge, type Node } from "@xyflow/react";
import { create } from "zustand";

import { getDiagramDefinition } from "../diagram/diagramRegistry";
import { detectDiagramType } from "../diagram/detectDiagramType";
import { mergeNodePositions } from "../diagram/mergeLayout";
import { maxMessageOrder } from "../diagram/sequenceLayout";
import type {
  DiagramEdgeData,
  DiagramNodeData,
  DiagramNodeKind,
  DiagramType,
  EdgeSide,
} from "../diagram/types";
import {
  clearProjectFromLocalStorage,
  createProjectSnapshot,
  loadProjectFromLocalStorage,
  parseProjectJson,
  saveProjectToLocalStorage,
} from "../project/projectService";
import type { StoredProject } from "../project/projectSchema";

const initialSource = getDiagramDefinition("class").initialSource;

const defaultEdgeData: DiagramEdgeData = {
  relation: "association",
  lineStyle: "curve",
  curveOffset: 0,
  arrowDirection: "forward",
};

const nodeDefaults: Record<
  DiagramNodeKind,
  { label: string; fill: string; stroke: string; text: string; type: string }
> = {
  class: {
    label: "NuevaClase",
    fill: "#e8f1ff",
    stroke: "#2f5d9f",
    text: "#111827",
    type: "umlClass",
  },
  interface: {
    label: "NuevaInterfaz",
    fill: "#ecfdf5",
    stroke: "#047857",
    text: "#111827",
    type: "umlClass",
  },
  enum: {
    label: "NuevoEnum",
    fill: "#fff7df",
    stroke: "#a86b00",
    text: "#111827",
    type: "umlClass",
  },
  note: { label: "Nota", fill: "#fef3c7", stroke: "#b45309", text: "#111827", type: "umlClass" },
  "activity-start": {
    label: "Inicio",
    fill: "#111827",
    stroke: "#111827",
    text: "#ffffff",
    type: "startEndNode",
  },
  activity: {
    label: "Actividad",
    fill: "#eef6ff",
    stroke: "#2563eb",
    text: "#111827",
    type: "activityNode",
  },
  "activity-decision": {
    label: "Decision",
    fill: "#fff7df",
    stroke: "#a86b00",
    text: "#111827",
    type: "decisionNode",
  },
  "activity-end": {
    label: "Fin",
    fill: "#111827",
    stroke: "#111827",
    text: "#ffffff",
    type: "startEndNode",
  },
  actor: { label: "Actor", fill: "#ffffff", stroke: "#111827", text: "#111827", type: "actorNode" },
  usecase: {
    label: "Caso de uso",
    fill: "#eef6ff",
    stroke: "#2563eb",
    text: "#111827",
    type: "useCaseNode",
  },
  "system-boundary": {
    label: "Sistema",
    fill: "#ffffff",
    stroke: "#64748b",
    text: "#334155",
    type: "systemBoundaryNode",
  },
  participant: {
    label: "Participante",
    fill: "#ffffff",
    stroke: "#2563eb",
    text: "#111827",
    type: "participantNode",
  },
};

interface DiagramState {
  source: string;
  diagramType: DiagramType;
  nodes: Array<Node<DiagramNodeData>>;
  edges: Array<Edge<DiagramEdgeData>>;
  selectedNodeId?: string;
  selectedNodeIds: string[];
  selectedEdgeId?: string;
  canvasBackground: "dark" | "light";
  errors: string[];
  syncStatus: "synced" | "codeDirty" | "visualDirty";
  projectError?: string;
  clipboardNodes: Array<Node<DiagramNodeData>>;
  past: Array<HistorySnapshot>;
  future: Array<HistorySnapshot>;
  setDiagramType: (diagramType: DiagramType) => void;
  setSource: (source: string) => void;
  setNodes: (nodes: Array<Node<DiagramNodeData>>) => void;
  setEdges: (edges: Array<Edge<DiagramEdgeData>>) => void;
  selectNode: (nodeId?: string) => void;
  setSelectedNodes: (nodeIds: string[]) => void;
  selectEdge: (edgeId?: string) => void;
  updateNodePosition: (nodeId: string, position: { x: number; y: number }) => void;
  addNode: (kind: DiagramNodeKind) => void;
  addEdge: (connection: Connection) => void;
  deleteSelected: () => void;
  undo: () => void;
  redo: () => void;
  copySelectedNodes: () => void;
  pasteNodes: () => void;
  duplicateSelectedNodes: () => void;
  alignSelectedNodes: (axis: "horizontal" | "vertical") => void;
  distributeSelectedNodes: (axis: "horizontal" | "vertical") => void;
  clearCanvas: (options?: { confirm?: boolean }) => void;
  updateSelectedNodeLabel: (label: string) => void;
  updateSelectedNodeColor: (fill: string) => void;
  updateSelectedNodeStroke: (stroke: string) => void;
  updateSelectedNodeTextColor: (text: string) => void;
  reverseSelectedEdge: () => void;
  updateSelectedEdgeType: (type: "curve" | "straight" | "step") => void;
  updateSelectedEdgeCurve: (curveOffset: number) => void;
  updateSelectedEdgeLabel: (label: string) => void;
  updateSelectedEdgeMessageKind: (messageKind: "message" | "response") => void;
  moveSelectedEdgeOrder: (direction: "up" | "down") => void;
  updateSelectedEdgeConnectionSide: (endpoint: "source" | "target", side: EdgeSide) => void;
  setCanvasBackground: (background: "dark" | "light") => void;
  generateFromSource: () => void;
  generateSourceFromVisual: (options?: { confirmOverwrite?: boolean }) => string | undefined;
  copySource: () => Promise<void>;
  newProject: (options?: { confirm?: boolean }) => void;
  importProjectJson: (json: string) => StoredProject | undefined;
  restoreLastProject: () => boolean;
  saveCurrentProject: () => void;
  exportProject: () => void;
}

interface HistorySnapshot {
  source: string;
  nodes: Array<Node<DiagramNodeData>>;
  edges: Array<Edge<DiagramEdgeData>>;
}

export const useDiagramStore = create<DiagramState>((set, get) => ({
  source: initialSource,
  diagramType: "class",
  nodes: [],
  edges: [],
  selectedNodeId: undefined,
  selectedNodeIds: [],
  selectedEdgeId: undefined,
  canvasBackground: "light",
  errors: [],
  syncStatus: "synced",
  projectError: undefined,
  clipboardNodes: [],
  past: [],
  future: [],
  setDiagramType: (diagramType) => {
    const definition = getDiagramDefinition(diagramType);

    set({
      diagramType,
      source: definition.initialSource,
      nodes: [],
      edges: [],
      selectedNodeId: undefined,
      selectedNodeIds: [],
      selectedEdgeId: undefined,
      errors: [],
    });
    get().generateFromSource();
  },
  setSource: (source) => {
    set((state) => {
      const detected = detectDiagramType(source);
      const canAutoSwitch = state.diagramType === "class" || state.diagramType === "sequence";

      return {
        source,
        projectError: undefined,
        syncStatus: "codeDirty" as const,
        ...(detected && canAutoSwitch ? { diagramType: detected } : {}),
      };
    });
  },
  setNodes: (nodes) => set({ nodes, projectError: undefined }),
  setEdges: (edges) => set({ edges, projectError: undefined }),
  selectNode: (nodeId) =>
    set((state) => {
      const nextNodeIds = nodeId ? [nodeId] : [];

      if (
        state.selectedNodeId === nodeId &&
        state.selectedEdgeId === undefined &&
        areStringArraysEqual(state.selectedNodeIds, nextNodeIds)
      ) {
        return state;
      }

      return { selectedNodeId: nodeId, selectedNodeIds: nextNodeIds, selectedEdgeId: undefined };
    }),
  setSelectedNodes: (nodeIds) =>
    set((state) => {
      if (
        state.selectedNodeId === nodeIds[0] &&
        state.selectedEdgeId === undefined &&
        areStringArraysEqual(state.selectedNodeIds, nodeIds)
      ) {
        return state;
      }

      return { selectedNodeIds: nodeIds, selectedNodeId: nodeIds[0], selectedEdgeId: undefined };
    }),
  selectEdge: (edgeId) =>
    set((state) => {
      if (
        state.selectedEdgeId === edgeId &&
        state.selectedNodeId === undefined &&
        state.selectedNodeIds.length === 0
      ) {
        return state;
      }

      return { selectedEdgeId: edgeId, selectedNodeId: undefined, selectedNodeIds: [] };
    }),
  updateNodePosition: (nodeId, position) => {
    set((state) => ({
      ...withHistory(state),
      nodes: state.nodes.map((node) => (node.id === nodeId ? { ...node, position } : node)),
    }));
  },
  addNode: (kind) => {
    const count = get().nodes.filter((node) => node.data.kind === kind).length + 1;
    const defaults = nodeDefaults[kind];
    const id = `${kind}-${Date.now()}-${count}`;

    const node: Node<DiagramNodeData> = {
      id,
      type: defaults.type,
      position: {
        x: kind === "participant" ? 120 + (count - 1) * 240 : 120 + (count % 4) * 32,
        y: kind === "participant" ? 80 : 120 + (count % 4) * 32,
      },
      data: {
        label: `${defaults.label}${kind === "note" ? "" : count}`,
        kind,
        style: {
          fill: defaults.fill,
          stroke: defaults.stroke,
          text: defaults.text,
        },
      },
    };

    set((state) => ({
      ...withHistory(state),
      nodes: [...state.nodes, node],
      selectedNodeId: id,
      selectedNodeIds: [id],
      selectedEdgeId: undefined,
    }));
  },
  addEdge: (connection) => {
    if (!connection.source || !connection.target) {
      return;
    }

    const diagramType = get().diagramType;
    const nextOrder = maxMessageOrder(get().edges) + 1;
    const edgeData: DiagramEdgeData = {
      ...defaultEdgeData,
      lineStyle: diagramType === "sequence" ? "straight" : defaultEdgeData.lineStyle,
      label: diagramType === "sequence" ? `mensaje ${nextOrder}` : undefined,
      messageKind: diagramType === "sequence" ? "message" : undefined,
      order: diagramType === "sequence" ? nextOrder : undefined,
    };
    const edge = applyArrowDirection(
      {
        id: `${connection.source}-${connection.target}-${Date.now()}`,
        source: connection.source,
        target: connection.target,
        sourceHandle: connection.sourceHandle,
        targetHandle: connection.targetHandle,
        type: "umlEditable",
        data: edgeData,
      },
      "forward",
    );

    set((state) => ({
      ...withHistory(state),
      edges: [...state.edges, edge],
      selectedEdgeId: edge.id,
      selectedNodeId: undefined,
      selectedNodeIds: [],
    }));
  },
  deleteSelected: () => {
    const { selectedNodeId, selectedNodeIds, selectedEdgeId } = get();
    const nodeIds = selectedNodeIds.length
      ? selectedNodeIds
      : selectedNodeId
        ? [selectedNodeId]
        : [];

    if (nodeIds.length) {
      set((state) => ({
        ...withHistory(state),
        nodes: state.nodes.filter((node) => !nodeIds.includes(node.id)),
        edges: state.edges.filter(
          (edge) => !nodeIds.includes(edge.source) && !nodeIds.includes(edge.target),
        ),
        selectedNodeId: undefined,
        selectedNodeIds: [],
        selectedEdgeId: undefined,
      }));
      return;
    }

    if (selectedEdgeId) {
      set((state) => ({
        ...withHistory(state),
        edges: state.edges.filter((edge) => edge.id !== selectedEdgeId),
        selectedEdgeId: undefined,
      }));
    }
  },
  undo: () => {
    set((state) => {
      const previous = state.past.at(-1);
      if (!previous) return state;
      return {
        source: previous.source,
        nodes: previous.nodes,
        edges: previous.edges,
        past: state.past.slice(0, -1),
        future: [takeSnapshot(state), ...state.future],
        selectedNodeId: undefined,
        selectedNodeIds: [],
        selectedEdgeId: undefined,
        syncStatus: "visualDirty",
      };
    });
  },
  redo: () => {
    set((state) => {
      const next = state.future[0];
      if (!next) return state;
      return {
        source: next.source,
        nodes: next.nodes,
        edges: next.edges,
        past: [...state.past, takeSnapshot(state)],
        future: state.future.slice(1),
        selectedNodeId: undefined,
        selectedNodeIds: [],
        selectedEdgeId: undefined,
        syncStatus: "visualDirty",
      };
    });
  },
  copySelectedNodes: () => {
    const { nodes, selectedNodeIds } = get();
    set({ clipboardNodes: nodes.filter((node) => selectedNodeIds.includes(node.id)) });
  },
  pasteNodes: () => {
    const { clipboardNodes } = get();
    if (!clipboardNodes.length) return;
    const pasted = clipboardNodes.map((node) => ({
      ...node,
      id: `${node.id}-copy-${Date.now()}`,
      position: { x: node.position.x + 40, y: node.position.y + 40 },
      selected: false,
    }));
    set((state) => ({
      ...withHistory(state),
      nodes: [...state.nodes, ...pasted],
      selectedNodeId: pasted[0]?.id,
      selectedNodeIds: pasted.map((node) => node.id),
      selectedEdgeId: undefined,
    }));
  },
  duplicateSelectedNodes: () => {
    get().copySelectedNodes();
    get().pasteNodes();
  },
  alignSelectedNodes: (axis) => {
    const { selectedNodeIds } = get();
    if (selectedNodeIds.length < 2) return;
    set((state) => {
      const selected = state.nodes.filter((node) => selectedNodeIds.includes(node.id));
      const anchor = selected[0].position;
      return {
        ...withHistory(state),
        nodes: state.nodes.map((node) =>
          selectedNodeIds.includes(node.id)
            ? {
                ...node,
                position:
                  axis === "horizontal"
                    ? { ...node.position, y: anchor.y }
                    : { ...node.position, x: anchor.x },
              }
            : node,
        ),
      };
    });
  },
  distributeSelectedNodes: (axis) => {
    const { selectedNodeIds } = get();
    if (selectedNodeIds.length < 3) return;
    set((state) => {
      const selected = state.nodes
        .filter((node) => selectedNodeIds.includes(node.id))
        .sort((a, b) =>
          axis === "horizontal" ? a.position.x - b.position.x : a.position.y - b.position.y,
        );
      const first = selected[0].position;
      const last = selected[selected.length - 1].position;
      const step =
        axis === "horizontal"
          ? (last.x - first.x) / (selected.length - 1)
          : (last.y - first.y) / (selected.length - 1);
      const positions = new Map(
        selected.map((node, index) => [
          node.id,
          axis === "horizontal" ? first.x + step * index : first.y + step * index,
        ]),
      );
      return {
        ...withHistory(state),
        nodes: state.nodes.map((node) =>
          positions.has(node.id)
            ? {
                ...node,
                position:
                  axis === "horizontal"
                    ? { ...node.position, x: positions.get(node.id)! }
                    : { ...node.position, y: positions.get(node.id)! },
              }
            : node,
        ),
      };
    });
  },
  clearCanvas: (options) => {
    const shouldConfirm = options?.confirm ?? true;
    if (
      shouldConfirm &&
      typeof window !== "undefined" &&
      !window.confirm("Esto limpiara el lienzo. ¿Continuar?")
    ) {
      return;
    }
    set((state) => ({
      ...withHistory(state),
      nodes: [],
      edges: [],
      selectedNodeId: undefined,
      selectedNodeIds: [],
      selectedEdgeId: undefined,
    }));
  },
  updateSelectedNodeLabel: (label) => {
    const selectedNodeId = get().selectedNodeId;

    if (!selectedNodeId) {
      return;
    }

    set((state) => ({
      ...withHistory(state),
      nodes: state.nodes.map((node) =>
        node.id === selectedNodeId
          ? {
              ...node,
              data: {
                ...node.data,
                label,
              },
            }
          : node,
      ),
    }));
  },
  updateSelectedNodeColor: (fill) => {
    const selectedNodeId = get().selectedNodeId;

    if (!selectedNodeId) {
      return;
    }

    set((state) => ({
      ...withHistory(state),
      nodes: state.nodes.map((node) =>
        node.id === selectedNodeId
          ? {
              ...node,
              data: {
                ...node.data,
                style: {
                  ...node.data.style,
                  fill,
                },
              },
            }
          : node,
      ),
    }));
  },
  updateSelectedNodeStroke: (stroke) => {
    const selectedNodeId = get().selectedNodeId;

    if (!selectedNodeId) {
      return;
    }

    set((state) => ({
      ...withHistory(state),
      nodes: state.nodes.map((node) =>
        node.id === selectedNodeId
          ? {
              ...node,
              data: {
                ...node.data,
                style: {
                  ...node.data.style,
                  stroke,
                },
              },
            }
          : node,
      ),
    }));
  },
  updateSelectedNodeTextColor: (text) => {
    const selectedNodeId = get().selectedNodeId;

    if (!selectedNodeId) {
      return;
    }

    set((state) => ({
      ...withHistory(state),
      nodes: state.nodes.map((node) =>
        node.id === selectedNodeId
          ? {
              ...node,
              data: {
                ...node.data,
                style: {
                  ...node.data.style,
                  text,
                },
              },
            }
          : node,
      ),
    }));
  },
  reverseSelectedEdge: () => {
    const selectedEdgeId = get().selectedEdgeId;

    if (!selectedEdgeId) {
      return;
    }

    set((state) => ({
      ...withHistory(state),
      edges: state.edges.map((edge) =>
        edge.id === selectedEdgeId ? applyArrowDirection(edge, getOppositeDirection(edge)) : edge,
      ),
      nodes: state.nodes.map((node) => ({
        ...node,
        data: {
          ...node.data,
          isEditingEdge: true,
        },
      })),
    }));
  },
  updateSelectedEdgeType: (type) => {
    const selectedEdgeId = get().selectedEdgeId;

    if (!selectedEdgeId) {
      return;
    }

    set((state) => ({
      ...withHistory(state),
      edges: state.edges.map((edge) =>
        edge.id === selectedEdgeId
          ? {
              ...edge,
              data: {
                ...(edge.data ?? defaultEdgeData),
                lineStyle: type,
              },
            }
          : edge,
      ),
      nodes: state.nodes.map((node) => ({
        ...node,
        data: {
          ...node.data,
          isEditingEdge: true,
        },
      })),
    }));
  },
  updateSelectedEdgeCurve: (curveOffset) => {
    const selectedEdgeId = get().selectedEdgeId;

    if (!selectedEdgeId) {
      return;
    }

    set((state) => ({
      ...withHistory(state),
      edges: state.edges.map((edge) =>
        edge.id === selectedEdgeId
          ? {
              ...edge,
              data: {
                ...(edge.data ?? defaultEdgeData),
                lineStyle: "curve",
                curveOffset,
              },
            }
          : edge,
      ),
      nodes: state.nodes.map((node) => ({
        ...node,
        data: {
          ...node.data,
          isEditingEdge: true,
        },
      })),
    }));
  },
  updateSelectedEdgeLabel: (label) => {
    const selectedEdgeId = get().selectedEdgeId;
    if (!selectedEdgeId) return;

    set((state) => ({
      ...withHistory(state),
      edges: state.edges.map((edge) =>
        edge.id === selectedEdgeId
          ? { ...edge, data: { ...(edge.data ?? defaultEdgeData), label } }
          : edge,
      ),
    }));
  },
  updateSelectedEdgeMessageKind: (messageKind) => {
    const selectedEdgeId = get().selectedEdgeId;
    if (!selectedEdgeId) return;

    set((state) => ({
      edges: state.edges.map((edge) =>
        edge.id === selectedEdgeId
          ? {
              ...edge,
              data: { ...(edge.data ?? defaultEdgeData), messageKind, lineStyle: "straight" },
            }
          : edge,
      ),
      syncStatus: "visualDirty" as const,
    }));
  },
  moveSelectedEdgeOrder: (direction) => {
    const selectedEdgeId = get().selectedEdgeId;
    if (!selectedEdgeId) return;

    set((state) => {
      const sorted = [...state.edges].sort((a, b) => (a.data?.order ?? 0) - (b.data?.order ?? 0));
      const index = sorted.findIndex((edge) => edge.id === selectedEdgeId);
      const swapIndex = direction === "up" ? index - 1 : index + 1;

      if (index < 0 || swapIndex < 0 || swapIndex >= sorted.length) {
        return state;
      }

      const current = sorted[index];
      const other = sorted[swapIndex];
      const currentOrder = current.data?.order ?? index + 1;
      const otherOrder = other.data?.order ?? swapIndex + 1;

      return {
        edges: state.edges.map((edge) => {
          if (edge.id === current.id) {
            return { ...edge, data: { ...(edge.data ?? defaultEdgeData), order: otherOrder } };
          }
          if (edge.id === other.id) {
            return { ...edge, data: { ...(edge.data ?? defaultEdgeData), order: currentOrder } };
          }
          return edge;
        }),
        syncStatus: "visualDirty" as const,
      };
    });
  },
  updateSelectedEdgeConnectionSide: (endpoint, side) => {
    const selectedEdgeId = get().selectedEdgeId;

    if (!selectedEdgeId) {
      return;
    }

    set((state) => ({
      edges: state.edges.map((edge) =>
        edge.id === selectedEdgeId
          ? {
              ...edge,
              [endpoint === "source" ? "sourceHandle" : "targetHandle"]:
                endpoint === "source" ? `${side}-source` : `${side}-target`,
            }
          : edge,
      ),
      nodes: state.nodes.map((node) => ({
        ...node,
        data: {
          ...node.data,
          isEditingEdge: true,
        },
      })),
      syncStatus: "visualDirty" as const,
    }));
  },
  setCanvasBackground: (background) => set({ canvasBackground: background }),
  generateFromSource: () => {
    const { diagramType, source, nodes: previousNodes } = get();
    const definition = getDiagramDefinition(diagramType);
    const result = definition.parse(source);
    const mergedNodes = mergeNodePositions(previousNodes, result.nodes);

    const nodeX = new Map(mergedNodes.map((node) => [node.id, node.position.x]));

    set({
      nodes: mergedNodes,
      edges: result.edges.map((edge) => {
        const isSequenceMessage = edge.data?.order !== undefined;
        const sourceIsLeftmost =
          isSequenceMessage && (nodeX.get(edge.source) ?? 0) <= (nodeX.get(edge.target) ?? 0);

        return {
          ...edge,
          type: "umlEditable",
          sourceHandle: sourceIsLeftmost ? "left-source" : "right-source",
          targetHandle: sourceIsLeftmost ? "right-target" : "left-target",
          ...applyArrowDirection(edge, "forward"),
        };
      }),
      errors: [...result.errors, ...definition.validate(mergedNodes, result.edges)],
      selectedNodeId: undefined,
      selectedNodeIds: [],
      selectedEdgeId: undefined,
      syncStatus: "synced",
    });
  },
  generateSourceFromVisual: (options) => {
    const { diagramType, nodes, edges, source } = get();
    const definition = getDiagramDefinition(diagramType);
    const generated = definition.generate(nodes, edges);
    const shouldConfirm = options?.confirmOverwrite ?? true;

    if (
      shouldConfirm &&
      typeof window !== "undefined" &&
      source.trim() &&
      source.trim() !== generated.trim()
    ) {
      const confirmed = window.confirm(
        "Esto reemplazara el codigo UML actual por el codigo generado desde el diagrama visual. ¿Continuar?",
      );

      if (!confirmed) {
        return undefined;
      }
    }

    set({
      source: generated,
      errors: definition.validate(nodes, edges),
      syncStatus: "synced",
    });
    return generated;
  },
  copySource: async () => {
    const source = get().source;

    if (typeof navigator !== "undefined" && navigator.clipboard) {
      await navigator.clipboard.writeText(source);
      return;
    }

    const textArea = document.createElement("textarea");
    textArea.value = source;
    document.body.appendChild(textArea);
    textArea.select();
    document.execCommand("copy");
    document.body.removeChild(textArea);
  },
  newProject: (options) => {
    const shouldConfirm = options?.confirm ?? true;

    if (shouldConfirm && typeof window !== "undefined") {
      const confirmed = window.confirm("Esto limpiara el proyecto actual. ¿Continuar?");

      if (!confirmed) {
        return;
      }
    }

    clearProjectFromLocalStorage();
    set({
      source: "@startuml\n@enduml",
      diagramType: "class",
      nodes: [],
      edges: [],
      selectedNodeId: undefined,
      selectedEdgeId: undefined,
      canvasBackground: "light",
      errors: [],
      projectError: undefined,
      syncStatus: "synced",
    });
  },
  importProjectJson: (json) => {
    try {
      const project = parseProjectJson(json);

      set({
        source: project.source,
        diagramType: project.diagramType,
        nodes: project.nodes as Array<Node<DiagramNodeData>>,
        edges: project.edges as Array<Edge<DiagramEdgeData>>,
        canvasBackground: project.canvasBackground,
        selectedNodeId: undefined,
        selectedEdgeId: undefined,
        errors: [],
        projectError: undefined,
        syncStatus: "synced" as const,
      });

      saveProjectToLocalStorage({
        source: project.source,
        diagramType: project.diagramType,
        nodes: project.nodes as Array<Node<DiagramNodeData>>,
        edges: project.edges as Array<Edge<DiagramEdgeData>>,
        canvasBackground: project.canvasBackground,
      });

      return project;
    } catch {
      set({ projectError: "El archivo JSON no tiene un formato de proyecto valido." });
      return undefined;
    }
  },
  restoreLastProject: () => {
    try {
      const project = loadProjectFromLocalStorage();

      if (!project) {
        return false;
      }

      set({
        source: project.source,
        diagramType: project.diagramType,
        nodes: project.nodes as Array<Node<DiagramNodeData>>,
        edges: project.edges as Array<Edge<DiagramEdgeData>>,
        canvasBackground: project.canvasBackground,
        selectedNodeId: undefined,
        selectedEdgeId: undefined,
        errors: [],
        projectError: undefined,
        syncStatus: "synced" as const,
      });

      return true;
    } catch {
      set({ projectError: "No se pudo restaurar el ultimo proyecto guardado." });
      return false;
    }
  },
  saveCurrentProject: () => {
    const { diagramType, source, nodes, edges, canvasBackground } = get();
    saveProjectToLocalStorage({ diagramType, source, nodes, edges, canvasBackground });
  },
  exportProject: () => {
    const { diagramType, source, nodes, edges, canvasBackground } = get();
    const payload = JSON.stringify(
      createProjectSnapshot({ diagramType, source, nodes, edges, canvasBackground }),
      null,
      2,
    );
    const blob = new Blob([payload], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");

    link.href = url;
    link.download = "uml-visual-project.json";
    link.click();
    URL.revokeObjectURL(url);
  },
}));

function getOppositeDirection(edge: Edge<DiagramEdgeData>) {
  return (edge.data?.arrowDirection ?? "forward") === "forward" ? "reverse" : "forward";
}

function applyArrowDirection(
  edge: Edge<DiagramEdgeData>,
  direction: DiagramEdgeData["arrowDirection"],
): Edge<DiagramEdgeData> {
  const data = {
    ...(edge.data ?? defaultEdgeData),
    arrowDirection: direction,
  };

  return {
    ...edge,
    data,
    markerStart: direction === "reverse" ? { type: MarkerType.ArrowClosed } : undefined,
    markerEnd: direction === "forward" ? { type: MarkerType.ArrowClosed } : undefined,
  };
}

function takeSnapshot(state: Pick<DiagramState, "source" | "nodes" | "edges">): HistorySnapshot {
  return {
    source: state.source,
    nodes: state.nodes,
    edges: state.edges,
  };
}

function withHistory(state: DiagramState) {
  return {
    past: [...state.past, takeSnapshot(state)].slice(-50),
    future: [],
    syncStatus: "visualDirty" as const,
  };
}

function areStringArraysEqual(left: string[], right: string[]) {
  return left.length === right.length && left.every((value, index) => value === right[index]);
}
