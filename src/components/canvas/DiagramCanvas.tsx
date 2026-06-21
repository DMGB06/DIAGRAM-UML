import {
  Background,
  BackgroundVariant,
  Controls,
  ReactFlow,
  type Edge,
  type EdgeTypes,
  type NodeTypes,
  type Node,
  useEdgesState,
  useNodesState,
} from "@xyflow/react";
import { useEffect } from "react";

import { useDiagramStore } from "../../store/useDiagramStore";
import type { DiagramEdgeData, DiagramNodeData } from "../../diagram/types";
import { EditableEdge } from "./edges/EditableEdge";
import { ClassNode } from "./nodes/ClassNode";

const nodeTypes: NodeTypes = {
  umlClass: ClassNode,
};

const edgeTypes: EdgeTypes = {
  umlEditable: EditableEdge,
};

export function DiagramCanvas() {
  const storeNodes = useDiagramStore((state) => state.nodes);
  const storeEdges = useDiagramStore((state) => state.edges);
  const setStoreNodes = useDiagramStore((state) => state.setNodes);
  const setStoreEdges = useDiagramStore((state) => state.setEdges);
  const selectNode = useDiagramStore((state) => state.selectNode);
  const selectEdge = useDiagramStore((state) => state.selectEdge);
  const selectedEdgeId = useDiagramStore((state) => state.selectedEdgeId);
  const updateNodePosition = useDiagramStore((state) => state.updateNodePosition);
  const canvasBackground = useDiagramStore((state) => state.canvasBackground);
  const generateFromSource = useDiagramStore((state) => state.generateFromSource);

  const [nodes, setNodes, onNodesChange] = useNodesState<Node<DiagramNodeData>>(storeNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState<Edge<DiagramEdgeData>>(storeEdges);

  useEffect(() => {
    generateFromSource();
  }, [generateFromSource]);

  useEffect(() => {
    setNodes(
      storeNodes.map((node) => ({
        ...node,
        data: {
          ...node.data,
          isEditingEdge: Boolean(selectedEdgeId),
        },
      })),
    );
  }, [selectedEdgeId, setNodes, storeNodes]);

  useEffect(() => {
    setEdges(storeEdges);
  }, [setEdges, storeEdges]);

  useEffect(() => {
    const clearSelection = (event: KeyboardEvent) => {
      if (event.key !== "Escape") {
        return;
      }

      selectNode(undefined);
      selectEdge(undefined);
    };

    window.addEventListener("keydown", clearSelection);
    return () => window.removeEventListener("keydown", clearSelection);
  }, [selectEdge, selectNode]);

  return (
    <ReactFlow
      className={canvasBackground === "light" ? "canvas-light" : "canvas-dark"}
      nodes={nodes}
      edges={edges}
      nodeTypes={nodeTypes}
      edgeTypes={edgeTypes}
      fitView
      onNodesChange={(changes) => {
        onNodesChange(changes);
        setTimeout(() => setStoreNodes(nodes), 0);
      }}
      onEdgesChange={(changes) => {
        onEdgesChange(changes);
        setTimeout(() => setStoreEdges(edges), 0);
      }}
      onNodeClick={(_, node) => selectNode(node.id)}
      onNodeDragStop={(_, node) => {
        updateNodePosition(node.id, node.position);
        document.body.style.cursor = "default";
      }}
      onEdgeClick={(_, edge) => selectEdge(edge.id)}
      onPaneClick={() => {
        selectNode(undefined);
        selectEdge(undefined);
      }}
    >
      <Background
        color={canvasBackground === "light" ? "#cbd5e1" : "#334155"}
        gap={24}
        variant={BackgroundVariant.Dots}
      />
      <Controls />
    </ReactFlow>
  );
}
