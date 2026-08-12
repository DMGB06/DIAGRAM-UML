import {
  Background,
  BackgroundVariant,
  Controls,
  ReactFlow,
  type Edge,
  type EdgeTypes,
  type NodeTypes,
  type Node,
  type ReactFlowInstance,
  useEdgesState,
  useNodesState,
} from "@xyflow/react";
import { useEffect, useRef } from "react";

import { useDiagramStore } from "../../store/useDiagramStore";
import type { DiagramEdgeData, DiagramNodeData } from "../../diagram/types";
import { EditableEdge } from "./edges/EditableEdge";
import { ActivityNode } from "./nodes/ActivityNode";
import { ActorNode } from "./nodes/ActorNode";
import { ClassNode } from "./nodes/ClassNode";
import { DecisionNode } from "./nodes/DecisionNode";
import { StartEndNode } from "./nodes/StartEndNode";
import { SystemBoundaryNode } from "./nodes/SystemBoundaryNode";
import { UseCaseNode } from "./nodes/UseCaseNode";
import { ParticipantNode } from "./nodes/ParticipantNode";
import { SelectionToolbar } from "./SelectionToolbar";

const nodeTypes: NodeTypes = {
  umlClass: ClassNode,
  activityNode: ActivityNode,
  decisionNode: DecisionNode,
  startEndNode: StartEndNode,
  actorNode: ActorNode,
  useCaseNode: UseCaseNode,
  systemBoundaryNode: SystemBoundaryNode,
  participantNode: ParticipantNode,
};

const edgeTypes: EdgeTypes = {
  umlEditable: EditableEdge,
};

export function DiagramCanvas() {
  const storeNodes = useDiagramStore((state) => state.nodes);
  const storeEdges = useDiagramStore((state) => state.edges);
  const selectNode = useDiagramStore((state) => state.selectNode);
  const setSelectedNodes = useDiagramStore((state) => state.setSelectedNodes);
  const selectEdge = useDiagramStore((state) => state.selectEdge);
  const addEdge = useDiagramStore((state) => state.addEdge);
  const selectedNodeId = useDiagramStore((state) => state.selectedNodeId);
  const selectedNodeIds = useDiagramStore((state) => state.selectedNodeIds);
  const selectedEdgeId = useDiagramStore((state) => state.selectedEdgeId);
  const updateNodePosition = useDiagramStore((state) => state.updateNodePosition);
  const canvasBackground = useDiagramStore((state) => state.canvasBackground);

  const [nodes, setNodes, onNodesChange] = useNodesState<Node<DiagramNodeData>>([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState<Edge<DiagramEdgeData>>([]);
  const instanceRef = useRef<ReactFlowInstance<
    Node<DiagramNodeData>,
    Edge<DiagramEdgeData>
  > | null>(null);

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
    setEdges(
      storeEdges.map((edge) => ({
        ...edge,
      })),
    );
  }, [selectedEdgeId, setEdges, storeEdges]);

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

  useEffect(() => {
    const zoomToSelection = () => {
      const selected = selectedNodeIds.length
        ? selectedNodeIds
        : selectedNodeId
          ? [selectedNodeId]
          : [];
      if (!selected.length || !instanceRef.current) return;
      instanceRef.current.fitView({
        padding: 0.25,
        nodes: selected.map((id) => ({ id })),
      });
    };

    window.addEventListener("uml:zoom-selection", zoomToSelection);
    return () => window.removeEventListener("uml:zoom-selection", zoomToSelection);
  }, [selectedNodeId, selectedNodeIds]);

  return (
    <ReactFlow
      className={canvasBackground === "light" ? "canvas-light" : "canvas-dark"}
      nodes={nodes}
      edges={edges}
      nodeTypes={nodeTypes}
      edgeTypes={edgeTypes}
      fitView
      onNodesChange={onNodesChange}
      onEdgesChange={onEdgesChange}
      onNodeClick={(_, node) => selectNode(node.id)}
      onConnect={addEdge}
      onSelectionChange={({ nodes: selectedNodes }) => {
        setSelectedNodes(selectedNodes.map((node) => node.id));
      }}
      onInit={(instance) => {
        instanceRef.current = instance;
        window.setTimeout(() => instance.fitView({ padding: 0.2 }), 0);
      }}
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
        color={canvasBackground === "light" ? "#e3e6ea" : "#2a2e36"}
        gap={20}
        variant={BackgroundVariant.Lines}
      />
      <Controls />
      <SelectionToolbar />
    </ReactFlow>
  );
}
