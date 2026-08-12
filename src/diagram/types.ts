export type DiagramType = "class" | "activity" | "usecase" | "sequence";
export type EdgeSide = "left" | "right" | "top" | "bottom";
export type DiagramElementIcon =
  | "class"
  | "interface"
  | "enum"
  | "note"
  | "start"
  | "activity"
  | "decision"
  | "end"
  | "actor"
  | "usecase"
  | "system"
  | "participant";
export type DiagramNodeKind =
  | "class"
  | "interface"
  | "enum"
  | "note"
  | "activity-start"
  | "activity"
  | "activity-decision"
  | "activity-end"
  | "actor"
  | "usecase"
  | "system-boundary"
  | "participant";

export interface DiagramNodeStyle {
  fill: string;
  stroke: string;
  text: string;
}

export interface DiagramNodeData extends Record<string, unknown> {
  label: string;
  kind: DiagramNodeKind;
  style: DiagramNodeStyle;
}

export interface DiagramElementDefinition {
  kind: DiagramNodeKind;
  label: string;
  description: string;
  icon: DiagramElementIcon;
}

export interface DiagramEdgeData extends Record<string, unknown> {
  label?: string;
  relation: "association" | "dependency" | "inheritance" | "composition" | "aggregation";
  lineStyle: "curve" | "straight" | "step";
  curveOffset: number;
  arrowDirection: "forward" | "reverse";
  messageKind?: "message" | "response";
  order?: number;
}

export interface ParserResult {
  nodes: Array<{
    id: string;
    type:
      | "umlClass"
      | "activityNode"
      | "decisionNode"
      | "startEndNode"
      | "actorNode"
      | "useCaseNode"
      | "systemBoundaryNode"
      | "participantNode";
    position: { x: number; y: number };
    data: DiagramNodeData;
  }>;
  edges: Array<{
    id: string;
    source: string;
    target: string;
    data: DiagramEdgeData;
  }>;
  errors: string[];
}
