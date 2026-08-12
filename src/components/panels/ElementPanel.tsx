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
    <section className="border-b border-[var(--line)] bg-[var(--paper)] p-3">
      <div className="mb-3">
        <h2 className="text-sm font-semibold text-[var(--ink)]">Elementos</h2>
        <p className="mt-1 text-xs text-[var(--graphite)]">{definition.elementPanelDescription}</p>
      </div>
      <div className="grid grid-cols-2 gap-2">
        {definition.elements.map((element) => {
          const Icon = iconsByElement[element.icon];

          return (
            <button
              key={element.kind}
              className="group rounded border border-[var(--line)] bg-[var(--surface)] p-3 text-left hover:border-[var(--accent)] hover:bg-[var(--paper)]"
              type="button"
              onClick={() => addNode(element.kind)}
            >
              <div className="flex items-center gap-2 text-sm font-medium text-[var(--ink)]">
                <Icon size={15} className="text-[var(--accent)]" />
                {element.label}
              </div>
              <p className="mt-1 text-xs text-[var(--graphite)] group-hover:text-[var(--ink)]">
                {element.description}
              </p>
            </button>
          );
        })}
      </div>
    </section>
  );
}
