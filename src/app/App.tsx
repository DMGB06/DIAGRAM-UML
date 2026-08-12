import { useEffect, useRef, useState } from "react";
import {
  ChevronLeft,
  ChevronRight,
  Clipboard,
  Code2,
  Download,
  Eraser,
  FileInput,
  FileJson,
  FilePlus2,
  FlipHorizontal2,
  FlipVertical2,
  PanelRight,
  Presentation,
  Redo2,
  Sparkles,
  Undo2,
} from "lucide-react";

import { DiagramCanvas } from "../components/canvas/DiagramCanvas";
import { CodeEditor } from "../components/editor/CodeEditor";
import { ElementPanel } from "../components/panels/ElementPanel";
import { PropertiesPanel } from "../components/panels/PropertiesPanel";
import { diagramDefinitions } from "../diagram/diagramRegistry";
import {
  exportDiagram,
  type ExportBackground,
  type ExportFormat,
  type ExportResolution,
  type ExportScope,
} from "../export/exportDiagram";
import { useDiagramStore } from "../store/useDiagramStore";

export function App() {
  const generateFromSource = useDiagramStore((state) => state.generateFromSource);
  const generateSourceFromVisual = useDiagramStore((state) => state.generateSourceFromVisual);
  const copySource = useDiagramStore((state) => state.copySource);
  const importProjectJson = useDiagramStore((state) => state.importProjectJson);
  const diagramType = useDiagramStore((state) => state.diagramType);
  const setDiagramType = useDiagramStore((state) => state.setDiagramType);
  const newProject = useDiagramStore((state) => state.newProject);
  const restoreLastProject = useDiagramStore((state) => state.restoreLastProject);
  const saveCurrentProject = useDiagramStore((state) => state.saveCurrentProject);
  const source = useDiagramStore((state) => state.source);
  const nodes = useDiagramStore((state) => state.nodes);
  const edges = useDiagramStore((state) => state.edges);
  const selectedNodeIds = useDiagramStore((state) => state.selectedNodeIds);
  const selectedEdgeId = useDiagramStore((state) => state.selectedEdgeId);
  const canvasBackground = useDiagramStore((state) => state.canvasBackground);
  const exportProject = useDiagramStore((state) => state.exportProject);
  const undo = useDiagramStore((state) => state.undo);
  const redo = useDiagramStore((state) => state.redo);
  const duplicateSelectedNodes = useDiagramStore((state) => state.duplicateSelectedNodes);
  const copySelectedNodes = useDiagramStore((state) => state.copySelectedNodes);
  const pasteNodes = useDiagramStore((state) => state.pasteNodes);
  const alignSelectedNodes = useDiagramStore((state) => state.alignSelectedNodes);
  const distributeSelectedNodes = useDiagramStore((state) => state.distributeSelectedNodes);
  const clearCanvas = useDiagramStore((state) => state.clearCanvas);
  const importInputRef = useRef<HTMLInputElement | null>(null);
  const [isCodePanelOpen, setIsCodePanelOpen] = useState(true);
  const [isPropertiesPanelOpen, setIsPropertiesPanelOpen] = useState(true);
  const [isPresentationMode, setIsPresentationMode] = useState(false);
  const [isExportPanelOpen, setIsExportPanelOpen] = useState(false);
  const [exportFormat, setExportFormat] = useState<ExportFormat>("png");
  const [exportScope, setExportScope] = useState<ExportScope>("all");
  const [exportBackground, setExportBackground] = useState<ExportBackground>("current");
  const [exportResolution, setExportResolution] = useState<ExportResolution>("standard");
  const gridColumns = [
    isCodePanelOpen && !isPresentationMode ? "360px" : null,
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

  const handleExport = async () => {
    await exportDiagram({
      format: exportFormat,
      scope: exportScope,
      background: exportBackground,
      resolution: exportResolution,
      diagramType,
      source,
      nodes,
      edges,
      selectedNodeIds,
      selectedEdgeId,
      canvasBackground,
    });
  };

  return (
    <main className="min-h-screen overflow-auto bg-slate-950 text-slate-100">
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
                <p className="text-xs text-slate-400">Codigo UML + edicion visual, sincronizados</p>
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
              <button className="toolbar-button primary" type="button" onClick={generateFromSource}>
                <Sparkles size={16} />
                Generar visual
              </button>
              <button
                className="toolbar-button"
                type="button"
                onClick={() => generateSourceFromVisual()}
              >
                <Code2 size={16} />
                Generar codigo
              </button>
              <div className="relative">
                <button
                  className="toolbar-button primary"
                  type="button"
                  onClick={() => setIsExportPanelOpen((value) => !value)}
                >
                  <Download size={16} />
                  Exportar
                </button>
                {isExportPanelOpen && (
                  <div className="export-popover">
                    <label className="toolbar-field stacked">
                      <span>Formato</span>
                      <select
                        className="toolbar-select"
                        value={exportFormat}
                        onChange={(event) => setExportFormat(event.target.value as ExportFormat)}
                      >
                        <option value="png">PNG</option>
                        <option value="svg">SVG</option>
                        <option value="pdf">PDF</option>
                        <option value="json">JSON</option>
                      </select>
                    </label>
                    <label className="toolbar-field stacked">
                      <span>Alcance</span>
                      <select
                        className="toolbar-select"
                        value={exportScope}
                        onChange={(event) => setExportScope(event.target.value as ExportScope)}
                      >
                        <option value="all">Todo el diagrama</option>
                        <option value="selection">Solo seleccion</option>
                      </select>
                    </label>
                    <label className="toolbar-field stacked">
                      <span>Fondo</span>
                      <select
                        className="toolbar-select"
                        value={exportBackground}
                        onChange={(event) =>
                          setExportBackground(event.target.value as ExportBackground)
                        }
                      >
                        <option value="current">Actual</option>
                        <option value="white">Blanco</option>
                        <option value="dark">Oscuro</option>
                        <option value="transparent">Transparente</option>
                      </select>
                    </label>
                    <label className="toolbar-field stacked">
                      <span>Resolucion</span>
                      <select
                        className="toolbar-select"
                        value={exportResolution}
                        onChange={(event) =>
                          setExportResolution(event.target.value as ExportResolution)
                        }
                      >
                        <option value="standard">Normal 1x</option>
                        <option value="high">Alta 2x</option>
                      </select>
                    </label>
                    <button
                      className="toolbar-button primary full"
                      type="button"
                      onClick={() => void handleExport()}
                    >
                      <Download size={16} />
                      Descargar
                    </button>
                    <button className="toolbar-button full" type="button" onClick={exportProject}>
                      <FileJson size={16} />
                      Descargar proyecto JSON
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="header-tools">
            <div className="toolbar-group">
              <span className="toolbar-group-label">Proyecto</span>
              <button className="toolbar-button compact" type="button" onClick={() => newProject()}>
                <FilePlus2 size={16} />
                Nuevo
              </button>
              <button
                className="toolbar-button compact"
                type="button"
                onClick={() => importInputRef.current?.click()}
              >
                <FileInput size={16} />
                Importar
              </button>
              <button
                className="toolbar-button compact"
                type="button"
                onClick={() => void copySource()}
              >
                <Clipboard size={16} />
                Copiar UML
              </button>
            </div>

            <div className="toolbar-group">
              <span className="toolbar-group-label">Edicion</span>
              <button className="icon-button" type="button" onClick={undo} title="Deshacer">
                <Undo2 size={16} />
              </button>
              <button className="icon-button" type="button" onClick={redo} title="Rehacer">
                <Redo2 size={16} />
              </button>
              <button className="toolbar-button compact" type="button" onClick={copySelectedNodes}>
                Copiar
              </button>
              <button className="toolbar-button compact" type="button" onClick={pasteNodes}>
                Pegar
              </button>
              <button
                className="toolbar-button compact"
                type="button"
                onClick={duplicateSelectedNodes}
              >
                Duplicar
              </button>
            </div>

            <div className="toolbar-group">
              <span className="toolbar-group-label">Organizar</span>
              <button
                className="icon-button"
                type="button"
                onClick={() => alignSelectedNodes("horizontal")}
                title="Alinear horizontal"
              >
                <FlipHorizontal2 size={16} />
              </button>
              <button
                className="icon-button"
                type="button"
                onClick={() => alignSelectedNodes("vertical")}
                title="Alinear vertical"
              >
                <FlipVertical2 size={16} />
              </button>
              <button
                className="toolbar-button compact"
                type="button"
                onClick={() => distributeSelectedNodes("horizontal")}
              >
                Distribuir
              </button>
            </div>

            <div className="toolbar-group">
              <span className="toolbar-group-label">Vista</span>
              <button
                className="toolbar-button compact"
                type="button"
                onClick={() => window.dispatchEvent(new Event("uml:zoom-selection"))}
              >
                Zoom seleccion
              </button>
              <button
                className="toolbar-button compact"
                type="button"
                onClick={() => setIsCodePanelOpen((value) => !value)}
                title={isCodePanelOpen ? "Contraer codigo" : "Mostrar codigo"}
              >
                {isCodePanelOpen ? <ChevronLeft size={16} /> : <ChevronRight size={16} />}
                Codigo
              </button>
              <button
                className="toolbar-button compact"
                type="button"
                onClick={() => setIsPropertiesPanelOpen((value) => !value)}
                title={isPropertiesPanelOpen ? "Contraer propiedades" : "Mostrar propiedades"}
              >
                <PanelRight size={16} />
                Propiedades
              </button>
              <button
                className="icon-button"
                type="button"
                onClick={() => setIsPresentationMode(true)}
                title="Modo presentacion"
              >
                <Presentation size={16} />
              </button>
              <button
                className="icon-button danger"
                type="button"
                onClick={() => clearCanvas()}
                title="Limpiar lienzo"
              >
                <Eraser size={16} />
              </button>
            </div>
          </div>
        </header>
      )}

      <section
        className={`grid ${isPresentationMode ? "min-h-screen" : "min-h-[calc(100vh-6.75rem)]"}`}
        style={{
          gridTemplateColumns: gridColumns,
        }}
      >
        {isCodePanelOpen && !isPresentationMode && (
          <aside className="flex min-h-[calc(100vh-6.75rem)] flex-col border-r border-slate-800 bg-slate-950">
            <ElementPanel />
            <div className="min-h-0 flex-1">
              <CodeEditor />
            </div>
          </aside>
        )}
        <section
          className={`${isPresentationMode ? "min-h-screen" : "min-h-[calc(100vh-6.75rem)]"} min-w-0 bg-slate-900`}
        >
          <DiagramCanvas />
        </section>
        {isPropertiesPanelOpen && !isPresentationMode && (
          <aside className="min-h-[calc(100vh-6.75rem)] border-l border-slate-800 bg-slate-950">
            <PropertiesPanel />
          </aside>
        )}
      </section>
    </main>
  );
}
