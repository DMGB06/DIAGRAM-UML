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
      <div className="border-b border-slate-800 bg-slate-900/70 p-3">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-sm font-semibold text-slate-100">Codigo UML</h2>
            <p className="mt-1 text-xs text-slate-400">
              Diagrama de {diagramLabel.toLowerCase()} compatible con sintaxis PlantUML.
            </p>
          </div>
          <span className="rounded border border-slate-700 bg-slate-950 px-2 py-1 text-[11px] font-medium text-cyan-200">
            PlantUML
          </span>
        </div>
      </div>
      <div className="grid min-h-0 flex-1 grid-cols-[48px_minmax(0,1fr)] bg-[#151a23]">
        <div className="select-none overflow-hidden border-r border-slate-700/60 bg-[#101722] py-4 pr-3 text-right font-mono text-[13px] leading-5 text-slate-600">
          {lineNumbers.map((line) => (
            <div key={line}>{line}</div>
          ))}
        </div>
        <textarea
          className="h-full w-full resize-none border-0 bg-[#151a23] p-4 font-mono text-[13px] leading-5 caret-cyan-300 outline-none placeholder:text-slate-600"
          style={{ color: "#aeb7c6" }}
          spellCheck={false}
          value={source}
          onChange={(event) => setSource(event.target.value)}
        />
      </div>
      {errors.length > 0 && (
        <div className="max-h-32 overflow-auto border-t border-amber-500/30 bg-amber-950/30 p-3 text-xs text-amber-100">
          {errors.map((error, index) => (
            <p key={`${index}-${error}`}>{error}</p>
          ))}
        </div>
      )}
    </div>
  );
}
