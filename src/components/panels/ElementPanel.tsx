import {
  Braces,
  Circle,
  CircleDot,
  Diamond,
  FileText,
  Frame,
  ListTree,
  UserRound,
  Play,
  UsersRound,
  SquareDashedMousePointer,
} from "lucide-react";

import { getDiagramDefinition } from "../../diagram/diagramRegistry";
import type { DiagramElementIcon } from "../../diagram/types";
import { useDiagramStore } from "../../store/useDiagramStore";

const iconsByElement: Record<DiagramElementIcon, typeof SquareDashedMousePointer> = {
  class: SquareDashedMousePointer,
  interface: Braces,
  enum: ListTree,
  note: FileText,
  start: Play,
  activity: Circle,
  decision: Diamond,
  end: CircleDot,
  actor: UserRound,
  usecase: Circle,
  system: Frame,
  participant: UsersRound,
};

export function ElementPanel() {
  const diagramType = useDiagramStore((state) => state.diagramType);
  const addNode = useDiagramStore((state) => state.addNode);
  const definition = getDiagramDefinition(diagramType);

  return (
    <section className="border-b border-slate-800 bg-slate-950 p-3">
      <div className="mb-3">
        <h2 className="text-sm font-semibold text-slate-100">Elementos</h2>
        <p className="mt-1 text-xs text-slate-400">{definition.elementPanelDescription}</p>
      </div>
      <div className="grid grid-cols-2 gap-2">
        {definition.elements.map((element) => {
          const Icon = iconsByElement[element.icon];

          return (
            <button
              key={element.kind}
              className="group rounded border border-slate-800 bg-slate-900 p-3 text-left hover:border-cyan-500/60 hover:bg-slate-800"
              type="button"
              onClick={() => addNode(element.kind)}
            >
              <div className="flex items-center gap-2 text-sm font-medium text-slate-100">
                <Icon size={15} className="text-cyan-300" />
                {element.label}
              </div>
              <p className="mt-1 text-xs text-slate-500 group-hover:text-slate-400">
                {element.description}
              </p>
            </button>
          );
        })}
      </div>
    </section>
  );
}
