import { useState } from "react";
import { ChevronLeft, ChevronRight, Code2, Download, FileJson, PanelRight, Sparkles } from "lucide-react";

import { DiagramCanvas } from "../components/canvas/DiagramCanvas";
import { CodeEditor } from "../components/editor/CodeEditor";
import { PropertiesPanel } from "../components/panels/PropertiesPanel";
import { useDiagramStore } from "../store/useDiagramStore";

export function App() {
  const generateFromSource = useDiagramStore((state) => state.generateFromSource);
  const exportProject = useDiagramStore((state) => state.exportProject);
  const [isCodePanelOpen, setIsCodePanelOpen] = useState(true);
  const [isPropertiesPanelOpen, setIsPropertiesPanelOpen] = useState(true);
  const gridColumns = [
    isCodePanelOpen ? "360px" : null,
    "minmax(0, 1fr)",
    isPropertiesPanelOpen ? "300px" : null,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <main className="min-h-screen overflow-auto bg-slate-950 text-slate-100">
      <header className="flex h-14 items-center justify-between border-b border-slate-800 bg-slate-950 px-4">
        <div className="flex items-center gap-3">
          <div className="flex size-9 items-center justify-center rounded bg-cyan-500 text-slate-950">
            <Code2 size={20} />
          </div>
          <div>
            <h1 className="text-sm font-semibold tracking-normal">UML Visual Studio</h1>
            <p className="text-xs text-slate-400">Codigo UML + edicion visual</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            className="toolbar-button"
            type="button"
            onClick={() => setIsCodePanelOpen((value) => !value)}
            title={isCodePanelOpen ? "Contraer codigo" : "Mostrar codigo"}
          >
            {isCodePanelOpen ? <ChevronLeft size={16} /> : <ChevronRight size={16} />}
            Codigo
          </button>
          <button
            className="toolbar-button"
            type="button"
            onClick={() => setIsPropertiesPanelOpen((value) => !value)}
            title={isPropertiesPanelOpen ? "Contraer propiedades" : "Mostrar propiedades"}
          >
            <PanelRight size={16} />
            Propiedades
          </button>
          <button className="toolbar-button" type="button" onClick={generateFromSource}>
            <Sparkles size={16} />
            Generar
          </button>
          <button className="toolbar-button" type="button" onClick={exportProject}>
            <FileJson size={16} />
            JSON
          </button>
          <button className="toolbar-button" type="button">
            <Download size={16} />
            Exportar
          </button>
        </div>
      </header>

      <section
        className="grid min-h-[calc(100vh-3.5rem)]"
        style={{
          gridTemplateColumns: gridColumns,
        }}
      >
        {isCodePanelOpen && (
          <aside className="min-h-[calc(100vh-3.5rem)] border-r border-slate-800 bg-slate-950">
            <CodeEditor />
          </aside>
        )}
        <section className="min-h-[calc(100vh-3.5rem)] min-w-0 bg-slate-900">
          <DiagramCanvas />
        </section>
        {isPropertiesPanelOpen && (
          <aside className="min-h-[calc(100vh-3.5rem)] border-l border-slate-800 bg-slate-950">
            <PropertiesPanel />
          </aside>
        )}
      </section>
    </main>
  );
}
