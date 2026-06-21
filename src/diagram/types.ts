export type DiagramType = "class";
export type EdgeSide = "left" | "right" | "top" | "bottom";

export interface DiagramNodeStyle {
  fill: string;
  stroke: string;
  text: string;
}

export interface DiagramNodeData extends Record<string, unknown> {
  label: string;
  kind: "class" | "interface" | "enum";
  style: DiagramNodeStyle;
}

export interface DiagramEdgeData extends Record<string, unknown> {
  label?: string;
  relation: "association" | "dependency" | "inheritance" | "composition" | "aggregation";
  lineStyle: "curve" | "straight" | "step";
  curveOffset: number;
  arrowDirection: "forward" | "reverse";
}

export interface ParserResult {
  nodes: Array<{
    id: string;
    type: "umlClass";
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
