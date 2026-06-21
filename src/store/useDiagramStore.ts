import { MarkerType, type Edge, type Node } from "@xyflow/react";
import { create } from "zustand";

import { parseClassDiagram } from "../diagram/parser/parseClassDiagram";
import type { DiagramEdgeData, DiagramNodeData, EdgeSide } from "../diagram/types";

const initialSource = `@startuml
class Usuario
class Pedido
class Producto
Usuario --> Pedido
Pedido --> Producto
@enduml`;

const defaultEdgeData: DiagramEdgeData = {
  relation: "association",
  lineStyle: "curve",
  curveOffset: 0,
  arrowDirection: "forward",
};

interface DiagramState {
  source: string;
  nodes: Array<Node<DiagramNodeData>>;
  edges: Array<Edge<DiagramEdgeData>>;
  selectedNodeId?: string;
  selectedEdgeId?: string;
  canvasBackground: "dark" | "light";
  errors: string[];
  setSource: (source: string) => void;
  setNodes: (nodes: Array<Node<DiagramNodeData>>) => void;
  setEdges: (edges: Array<Edge<DiagramEdgeData>>) => void;
  selectNode: (nodeId?: string) => void;
  selectEdge: (edgeId?: string) => void;
  updateNodePosition: (nodeId: string, position: { x: number; y: number }) => void;
  updateSelectedNodeColor: (fill: string) => void;
  reverseSelectedEdge: () => void;
  updateSelectedEdgeType: (type: "curve" | "straight" | "step") => void;
  updateSelectedEdgeCurve: (curveOffset: number) => void;
  updateSelectedEdgeConnectionSide: (endpoint: "source" | "target", side: EdgeSide) => void;
  setCanvasBackground: (background: "dark" | "light") => void;
  generateFromSource: () => void;
  exportProject: () => void;
}

export const useDiagramStore = create<DiagramState>((set, get) => ({
  source: initialSource,
  nodes: [],
  edges: [],
  selectedNodeId: undefined,
  selectedEdgeId: undefined,
  canvasBackground: "light",
  errors: [],
  setSource: (source) => set({ source }),
  setNodes: (nodes) => set({ nodes }),
  setEdges: (edges) => set({ edges }),
  selectNode: (nodeId) => set({ selectedNodeId: nodeId, selectedEdgeId: undefined }),
  selectEdge: (edgeId) => set({ selectedEdgeId: edgeId, selectedNodeId: undefined }),
  updateNodePosition: (nodeId, position) => {
    set((state) => ({
      nodes: state.nodes.map((node) => (node.id === nodeId ? { ...node, position } : node)),
    }));
  },
  updateSelectedNodeColor: (fill) => {
    const selectedNodeId = get().selectedNodeId;

    if (!selectedNodeId) {
      return;
    }

    set((state) => ({
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
  reverseSelectedEdge: () => {
    const selectedEdgeId = get().selectedEdgeId;

    if (!selectedEdgeId) {
      return;
    }

    set((state) => ({
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
    }));
  },
  setCanvasBackground: (background) => set({ canvasBackground: background }),
  generateFromSource: () => {
    const result = parseClassDiagram(get().source);

    set({
      nodes: result.nodes,
      edges: result.edges.map((edge) => ({
        ...edge,
        type: "umlEditable",
        sourceHandle: "right-source",
        targetHandle: "left-target",
        ...applyArrowDirection(edge, "forward"),
      })),
      errors: result.errors,
      selectedNodeId: undefined,
      selectedEdgeId: undefined,
    });
  },
  exportProject: () => {
    const { source, nodes, edges, canvasBackground } = get();
    const payload = JSON.stringify({ source, nodes, edges, canvasBackground }, null, 2);
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
