import type { Edge, Node } from "@xyflow/react";

import type { DiagramEdgeData, DiagramNodeData } from "../types";

export function validateUseCaseDiagram(
  nodes: Array<Node<DiagramNodeData>>,
  edges: Array<Edge<DiagramEdgeData>>,
) {
  const errors: string[] = [];
  const hasActor = nodes.some((node) => node.data.kind === "actor");
  const hasUseCase = nodes.some((node) => node.data.kind === "usecase");
  const actorIds = new Set(
    nodes.filter((node) => node.data.kind === "actor").map((node) => node.id),
  );
  const useCaseIds = new Set(
    nodes.filter((node) => node.data.kind === "usecase").map((node) => node.id),
  );
  const hasActorUseCaseEdge = edges.some(
    (edge) =>
      (actorIds.has(edge.source) && useCaseIds.has(edge.target)) ||
      (actorIds.has(edge.target) && useCaseIds.has(edge.source)),
  );

  if (!hasActor) errors.push("El diagrama de casos de uso necesita al menos un actor.");
  if (!hasUseCase) errors.push("El diagrama de casos de uso necesita al menos un caso de uso.");
  if (hasActor && hasUseCase && !hasActorUseCaseEdge) {
    errors.push("Debe existir al menos una relacion entre actor y caso de uso.");
  }

  return errors;
}
