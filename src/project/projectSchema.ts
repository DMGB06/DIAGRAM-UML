import { z } from "zod";

const positionSchema = z.object({
  x: z.number(),
  y: z.number(),
});

const nodeStyleSchema = z.object({
  fill: z.string(),
  stroke: z.string(),
  text: z.string(),
});

const nodeDataSchema = z.object({
  label: z.string(),
  kind: z.enum([
    "class",
    "interface",
    "enum",
    "note",
    "activity-start",
    "activity",
    "activity-decision",
    "activity-end",
    "actor",
    "usecase",
    "system-boundary",
    "participant",
  ]),
  style: nodeStyleSchema,
});

const nodeSchema = z.object({
  id: z.string(),
  type: z.string().optional(),
  position: positionSchema,
  data: nodeDataSchema,
});

const edgeDataSchema = z.object({
  label: z.string().optional(),
  relation: z.enum(["association", "dependency", "inheritance", "composition", "aggregation"]),
  lineStyle: z.enum(["curve", "straight", "step"]),
  curveOffset: z.number(),
  arrowDirection: z.enum(["forward", "reverse"]),
  messageKind: z.enum(["message", "response"]).optional(),
  order: z.number().optional(),
});

const edgeSchema = z.object({
  id: z.string(),
  source: z.string(),
  target: z.string(),
  sourceHandle: z.string().nullable().optional(),
  targetHandle: z.string().nullable().optional(),
  type: z.string().optional(),
  data: edgeDataSchema.optional(),
});

export const projectSchema = z.object({
  version: z.literal(1).default(1),
  name: z.string().default("Proyecto UML"),
  diagramType: z.enum(["class", "activity", "usecase", "sequence"]).default("class"),
  source: z.string(),
  nodes: z.array(nodeSchema),
  edges: z.array(edgeSchema),
  canvasBackground: z.enum(["dark", "light"]).default("light"),
  updatedAt: z.string().optional(),
});

export type StoredProject = z.infer<typeof projectSchema>;
