import { getDiagramDefinition } from "../../diagram/diagramRegistry";
import { useDiagramStore } from "../../store/useDiagramStore";

export function CodeEditor() {
  const source = useDiagramStore((state) => state.source);
  const diagramType = useDiagramStore((state) => state.diagramType);
  const setSource = useDiagramStore((state) => state.setSource);
  const errors = useDiagramStore((state) => state.errors);
  const diagramLabel = getDiagramDefinition(diagramType).label;
  const lineNumbers = source.split("\n").map((_, index) => index + 1);

  return (
    <div className="flex h-full flex-col">
      <div className="border-b border-[var(--line)] bg-[var(--surface)] p-3">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-sm font-semibold text-[var(--ink)]">Codigo UML</h2>
            <p className="mt-1 text-xs text-[var(--graphite)]">
              Diagrama de {diagramLabel.toLowerCase()} compatible con sintaxis PlantUML.
            </p>
          </div>
          <span className="rounded border border-[var(--line)] bg-[var(--paper)] px-2 py-1 text-[11px] font-medium text-[var(--accent)]">
            PlantUML
          </span>
        </div>
      </div>
      <div className="grid min-h-0 flex-1 grid-cols-[48px_minmax(0,1fr)] bg-[var(--surface)]">
        <div className="select-none overflow-hidden border-r border-[var(--line)] bg-[var(--paper)] py-4 pr-3 text-right font-mono text-[13px] leading-5 text-[var(--graphite)]">
          {lineNumbers.map((line) => (
            <div key={line}>{line}</div>
          ))}
        </div>
        <textarea
          className="h-full w-full resize-none border-0 bg-[var(--surface)] p-4 font-mono text-[13px] leading-5 outline-none placeholder:text-[var(--graphite)]"
          style={{ color: "var(--ink)", caretColor: "var(--accent)" }}
          spellCheck={false}
          value={source}
          onChange={(event) => setSource(event.target.value)}
        />
      </div>
      {errors.length > 0 && (
        <div className="max-h-32 overflow-auto border-t border-[var(--danger)]/30 bg-[var(--danger-soft)] p-3 text-xs text-[var(--danger)]">
          {errors.map((error, index) => (
            <p key={`${index}-${error}`}>{error}</p>
          ))}
        </div>
      )}
    </div>
  );
}
