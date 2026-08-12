import type { Edge, Node } from "@xyflow/react";

import type { DiagramEdgeData, DiagramNodeData } from "../diagram/types";
import type { DiagramType } from "../diagram/types";
import { projectSchema, type StoredProject } from "./projectSchema";

export const PROJECT_STORAGE_KEY = "uml-visual-studio:last-project";

export interface ProjectSnapshotInput {
  diagramType: DiagramType;
  source: string;
  nodes: Array<Node<DiagramNodeData>>;
  edges: Array<Edge<DiagramEdgeData>>;
  canvasBackground: "dark" | "light";
}

export function createProjectSnapshot(input: ProjectSnapshotInput): StoredProject {
  return projectSchema.parse({
    version: 1,
    name: "Proyecto UML",
    diagramType: input.diagramType,
    source: input.source,
    nodes: input.nodes,
    edges: input.edges,
    canvasBackground: input.canvasBackground,
    updatedAt: new Date().toISOString(),
  });
}

export function serializeProject(input: ProjectSnapshotInput) {
  return JSON.stringify(createProjectSnapshot(input), null, 2);
}

export function parseProjectJson(json: string): StoredProject {
  const parsed = JSON.parse(json) as unknown;
  return projectSchema.parse(parsed);
}

export function saveProjectToLocalStorage(input: ProjectSnapshotInput) {
  if (typeof localStorage === "undefined") {
    return;
  }

  localStorage.setItem(PROJECT_STORAGE_KEY, serializeProject(input));
}

export function loadProjectFromLocalStorage() {
  if (typeof localStorage === "undefined") {
    return undefined;
  }

  const raw = localStorage.getItem(PROJECT_STORAGE_KEY);

  if (!raw) {
    return undefined;
  }

  return parseProjectJson(raw);
}

export function clearProjectFromLocalStorage() {
  if (typeof localStorage === "undefined") {
    return;
  }

  localStorage.removeItem(PROJECT_STORAGE_KEY);
}
