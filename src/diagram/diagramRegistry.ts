import type { Edge, Node } from "@xyflow/react";

import { toPlantUml } from "./generators/toPlantUml";
import { toPlantUmlActivity } from "./generators/toPlantUmlActivity";
import { toPlantUmlSequence } from "./generators/toPlantUmlSequence";
import { toPlantUmlUseCase } from "./generators/toPlantUmlUseCase";
import { parseActivityDiagram } from "./parser/parseActivityDiagram";
import { parseClassDiagram } from "./parser/parseClassDiagram";
import { parseSequenceDiagram } from "./parser/parseSequenceDiagram";
import { parseUseCaseDiagram } from "./parser/parseUseCaseDiagram";
import type {
  DiagramEdgeData,
  DiagramElementDefinition,
  DiagramNodeData,
  DiagramType,
  ParserResult,
} from "./types";
import { validateActivityDiagram } from "./validators/validateActivityDiagram";
import { validateDiagram } from "./validators/validateDiagram";
import { validateSequenceDiagram } from "./validators/validateSequenceDiagram";
import { validateUseCaseDiagram } from "./validators/validateUseCaseDiagram";

export interface DiagramDefinition {
  type: DiagramType;
  label: string;
  elementPanelDescription: string;
  initialSource: string;
  elements: DiagramElementDefinition[];
  parse: (source: string) => ParserResult;
  generate: (nodes: Array<Node<DiagramNodeData>>, edges: Array<Edge<DiagramEdgeData>>) => string;
  validate: (nodes: Array<Node<DiagramNodeData>>, edges: Array<Edge<DiagramEdgeData>>) => string[];
}

export const diagramRegistry = {
  class: {
    type: "class",
    label: "Clases",
    elementPanelDescription: "Elementos para clases.",
    initialSource: `@startuml
class Usuario
class Pedido
class Producto
Usuario --> Pedido
Pedido --> Producto
@enduml`,
    elements: [
      { kind: "class", label: "Clase", description: "Entidad principal", icon: "class" },
      { kind: "interface", label: "Interfaz", description: "Contrato publico", icon: "interface" },
      { kind: "enum", label: "Enum", description: "Valores constantes", icon: "enum" },
      { kind: "note", label: "Nota", description: "Comentario visual", icon: "note" },
    ],
    parse: parseClassDiagram,
    generate: toPlantUml,
    validate: validateDiagram,
  },
  activity: {
    type: "activity",
    label: "Actividades",
    elementPanelDescription: "Elementos para actividades.",
    initialSource: "@startuml\nstart\n:Actividad;\nstop\n@enduml",
    elements: [
      { kind: "activity-start", label: "Inicio", description: "Comienzo del flujo", icon: "start" },
      { kind: "activity", label: "Actividad", description: "Paso del proceso", icon: "activity" },
      {
        kind: "activity-decision",
        label: "Decision",
        description: "Rama condicional",
        icon: "decision",
      },
      { kind: "activity-end", label: "Fin", description: "Cierre del flujo", icon: "end" },
    ],
    parse: parseActivityDiagram,
    generate: toPlantUmlActivity,
    validate: (nodes, _edges) => validateActivityDiagram(nodes),
  },
  usecase: {
    type: "usecase",
    label: "Casos de uso",
    elementPanelDescription: "Elementos para casos de uso.",
    initialSource:
      '@startuml\nactor Cliente\nusecase "Comprar producto" as Comprar\nCliente --> Comprar\n@enduml',
    elements: [
      { kind: "actor", label: "Actor", description: "Usuario externo", icon: "actor" },
      { kind: "usecase", label: "Caso de uso", description: "Objetivo del actor", icon: "usecase" },
      {
        kind: "system-boundary",
        label: "Sistema",
        description: "Limite del sistema",
        icon: "system",
      },
      { kind: "note", label: "Nota", description: "Comentario visual", icon: "note" },
    ],
    parse: parseUseCaseDiagram,
    generate: toPlantUmlUseCase,
    validate: validateUseCaseDiagram,
  },
  sequence: {
    type: "sequence",
    label: "Secuencia",
    elementPanelDescription: "Elementos para secuencia.",
    initialSource:
      '@startuml\nparticipant "Cliente" as Cliente\nparticipant "Sistema" as Sistema\nCliente -> Sistema: Solicitar acceso\nSistema -->> Cliente: Respuesta\n@enduml',
    elements: [
      {
        kind: "participant",
        label: "Participante",
        description: "Linea de vida",
        icon: "participant",
      },
    ],
    parse: parseSequenceDiagram,
    generate: toPlantUmlSequence,
    validate: validateSequenceDiagram,
  },
} satisfies Record<DiagramType, DiagramDefinition>;

export const diagramDefinitions = Object.values(diagramRegistry);

export function getDiagramDefinition(diagramType: DiagramType) {
  return diagramRegistry[diagramType];
}
