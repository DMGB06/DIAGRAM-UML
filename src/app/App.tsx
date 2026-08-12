import { useEffect, useRef, useState, type CSSProperties } from "react";
import { Code2, RefreshCw } from "lucide-react";

import { DiagramCanvas } from "../components/canvas/DiagramCanvas";
import { CodeEditor } from "../components/editor/CodeEditor";
import { OverflowMenu } from "../components/header/OverflowMenu";
import { ElementPanel } from "../components/panels/ElementPanel";
import { PropertiesPanel } from "../components/panels/PropertiesPanel";
import { getDiagramAccent } from "../diagram/diagramAccent";
import { diagramDefinitions, getDiagramDefinition } from "../diagram/diagramRegistry";
import { shouldShowTypeSelector } from "../diagram/typeSelectorVisibility";
import { useDiagramStore } from "../store/useDiagramStore";

export function App() {
  const generateFromSource = useDiagramStore((state) => state.generateFromSource);
  const generateSourceFromVisual = useDiagramStore((state) => state.generateSourceFromVisual);
  const importProjectJson = useDiagramStore((state) => state.importProjectJson);
  const diagramType = useDiagramStore((state) => state.diagramType);
  const setDiagramType = useDiagramStore((state) => state.setDiagramType);
  const restoreLastProject = useDiagramStore((state) => state.restoreLastProject);
  const saveCurrentProject = useDiagramStore((state) => state.saveCurrentProject);
  const source = useDiagramStore((state) => state.source);
  const nodes = useDiagramStore((state) => state.nodes);
  const edges = useDiagramStore((state) => state.edges);
  const canvasBackground = useDiagramStore((state) => state.canvasBackground);
  const syncStatus = useDiagramStore((state) => state.syncStatus);
  const importInputRef = useRef<HTMLInputElement | null>(null);
  const [isLeftPanelOpen, setIsLeftPanelOpen] = useState(true);
  const [activeLeftTab, setActiveLeftTab] = useState<"elementos" | "codigo">("elementos");
  const [isPropertiesPanelOpen, setIsPropertiesPanelOpen] = useState(true);
  const [isPresentationMode, setIsPresentationMode] = useState(false);
  const gridColumns = [
    isLeftPanelOpen && !isPresentationMode ? "360px" : null,
    "minmax(0, 1fr)",
    isPropertiesPanelOpen && !isPresentationMode ? "300px" : null,
  ]
    .filter(Boolean)
    .join(" ");

  useEffect(() => {
    const restored = restoreLastProject();
    if (!restored) {
      generateFromSource();
    }
  }, [generateFromSource, restoreLastProject]);

  useEffect(() => {
    const timeout = window.setTimeout(() => {
      saveCurrentProject();
    }, 400);

    return () => window.clearTimeout(timeout);
  }, [canvasBackground, edges, nodes, saveCurrentProject, source]);

  const handleImportProject = async (file?: File) => {
    if (!file) {
      return;
    }

    importProjectJson(await file.text());

    if (importInputRef.current) {
      importInputRef.current.value = "";
    }
  };

  const handleSync = () => {
    if (syncStatus === "codeDirty") {
      generateFromSource();
    } else if (syncStatus === "visualDirty") {
      generateSourceFromVisual();
    }
  };

  const syncTitle =
    syncStatus === "codeDirty"
      ? "Generar visual desde el codigo"
      : syncStatus === "visualDirty"
        ? "Generar codigo desde el visual"
        : "Ya sincronizado";

  const showTypeSelector = shouldShowTypeSelector(diagramType, source);
  const diagramLabel = getDiagramDefinition(diagramType).label;
  const { accent, accentSoft } = getDiagramAccent(diagramType);

  return (
    <main
      className="min-h-screen overflow-auto bg-[var(--paper)] text-[var(--ink)]"
      style={{ "--accent": accent, "--accent-soft": accentSoft } as CSSProperties}
    >
      {isPresentationMode && (
        <button
          className="toolbar-button fixed right-4 top-4 z-50"
          type="button"
          onClick={() => setIsPresentationMode(false)}
        >
          Salir
        </button>
      )}
      {!isPresentationMode && (
        <header className="app-header">
          <div className="header-main">
            <div className="brand-block">
              <div className="brand-icon">
                <Code2 size={20} />
              </div>
              <div>
                <h1 className="text-sm font-semibold tracking-normal">UMLSync</h1>
                <p className="text-xs text-[var(--graphite)]">
                  Codigo UML + edicion visual, sincronizados
                </p>
              </div>
            </div>

            <div className="primary-actions">
              <input
                ref={importInputRef}
                className="hidden"
                type="file"
                accept="application/json,.json"
                onChange={(event) => void handleImportProject(event.target.files?.[0])}
              />
              {showTypeSelector ? (
                <label className="toolbar-field">
                  <span>Diagrama</span>
                  <select
                    className="toolbar-select"
                    value={diagramType}
                    onChange={(event) => setDiagramType(event.target.value as typeof diagramType)}
                  >
                    {diagramDefinitions.map((definition) => (
                      <option key={definition.type} value={definition.type}>
                        {definition.label}
                      </option>
                    ))}
                  </select>
                </label>
              ) : (
                <span className="type-badge">
                  <span className="type-badge-dot" />
                  {diagramLabel} · detectado
                </span>
              )}
              <button
                className="toolbar-button primary"
                type="button"
                onClick={handleSync}
                disabled={syncStatus === "synced"}
                title={syncTitle}
              >
                <RefreshCw size={16} />
                Sincronizar
              </button>
              <OverflowMenu
                isPropertiesPanelOpen={isPropertiesPanelOpen}
                onToggleProperties={() => setIsPropertiesPanelOpen((value) => !value)}
                isLeftPanelOpen={isLeftPanelOpen}
                onToggleLeftPanel={() => setIsLeftPanelOpen((value) => !value)}
                onEnterPresentation={() => setIsPresentationMode(true)}
                onImportClick={() => importInputRef.current?.click()}
              />
            </div>
          </div>
        </header>
      )}

      <section
        className={`grid ${isPresentationMode ? "min-h-screen" : "min-h-[calc(100vh-4rem)]"}`}
        style={{
          gridTemplateColumns: gridColumns,
        }}
      >
        {isLeftPanelOpen && !isPresentationMode && (
          <aside className="flex min-h-[calc(100vh-4rem)] flex-col border-r border-[var(--line)] bg-[var(--paper)]">
            <div className="left-panel-tabs">
              <button
                type="button"
                className={`left-panel-tab ${activeLeftTab === "elementos" ? "active" : ""}`}
                onClick={() => setActiveLeftTab("elementos")}
              >
                Elementos
              </button>
              <button
                type="button"
                className={`left-panel-tab ${activeLeftTab === "codigo" ? "active" : ""}`}
                onClick={() => setActiveLeftTab("codigo")}
              >
                Codigo
              </button>
            </div>
            <div className="min-h-0 flex-1">
              {activeLeftTab === "elementos" ? <ElementPanel /> : <CodeEditor />}
            </div>
          </aside>
        )}
        <section
          className={`${isPresentationMode ? "min-h-screen" : "min-h-[calc(100vh-4rem)]"} min-w-0 bg-[var(--surface)]`}
        >
          <DiagramCanvas />
        </section>
        {isPropertiesPanelOpen && !isPresentationMode && (
          <aside className="min-h-[calc(100vh-4rem)] border-l border-[var(--line)] bg-[var(--paper)]">
            <PropertiesPanel />
          </aside>
        )}
      </section>
    </main>
  );
}
