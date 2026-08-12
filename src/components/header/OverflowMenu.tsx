import { useState } from "react";
import {
  Download,
  Eraser,
  FileInput,
  FileJson,
  FilePlus2,
  Maximize2,
  Moon,
  MoreHorizontal,
  PanelLeft,
  PanelRight,
  Presentation,
  Sun,
} from "lucide-react";

import {
  exportDiagram,
  type ExportBackground,
  type ExportFormat,
  type ExportResolution,
  type ExportScope,
} from "../../export/exportDiagram";
import { useDiagramStore } from "../../store/useDiagramStore";

interface OverflowMenuProps {
  isPropertiesPanelOpen: boolean;
  onToggleProperties: () => void;
  isLeftPanelOpen: boolean;
  onToggleLeftPanel: () => void;
  onEnterPresentation: () => void;
  onImportClick: () => void;
  isDarkTheme: boolean;
  onToggleTheme: () => void;
}

export function OverflowMenu({
  isPropertiesPanelOpen,
  onToggleProperties,
  isLeftPanelOpen,
  onToggleLeftPanel,
  onEnterPresentation,
  onImportClick,
  isDarkTheme,
  onToggleTheme,
}: OverflowMenuProps) {
  const newProject = useDiagramStore((state) => state.newProject);
  const copySource = useDiagramStore((state) => state.copySource);
  const clearCanvas = useDiagramStore((state) => state.clearCanvas);
  const exportProject = useDiagramStore((state) => state.exportProject);
  const diagramType = useDiagramStore((state) => state.diagramType);
  const source = useDiagramStore((state) => state.source);
  const nodes = useDiagramStore((state) => state.nodes);
  const edges = useDiagramStore((state) => state.edges);
  const selectedNodeIds = useDiagramStore((state) => state.selectedNodeIds);
  const selectedEdgeId = useDiagramStore((state) => state.selectedEdgeId);
  const canvasBackground = useDiagramStore((state) => state.canvasBackground);

  const [isOpen, setIsOpen] = useState(false);
  const [isExportOpen, setIsExportOpen] = useState(false);
  const [exportFormat, setExportFormat] = useState<ExportFormat>("png");
  const [exportScope, setExportScope] = useState<ExportScope>("all");
  const [exportBackground, setExportBackground] = useState<ExportBackground>("current");
  const [exportResolution, setExportResolution] = useState<ExportResolution>("standard");

  const closeMenu = () => {
    setIsOpen(false);
    setIsExportOpen(false);
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
    closeMenu();
  };

  return (
    <div className="overflow-menu">
      <button
        className="toolbar-button"
        type="button"
        onClick={() => setIsOpen((value) => !value)}
        title="Mas opciones"
      >
        <MoreHorizontal size={16} />
      </button>

      {isOpen && (
        <div className="overflow-menu-panel">
          <p className="overflow-menu-section-label">Proyecto</p>
          <button
            className="overflow-menu-item"
            type="button"
            onClick={() => {
              newProject();
              closeMenu();
            }}
          >
            <FilePlus2 size={15} />
            Nuevo
          </button>
          <button
            className="overflow-menu-item"
            type="button"
            onClick={() => {
              onImportClick();
              closeMenu();
            }}
          >
            <FileInput size={15} />
            Importar
          </button>
          <button
            className="overflow-menu-item"
            type="button"
            onClick={() => {
              void copySource();
              closeMenu();
            }}
          >
            <FileJson size={15} />
            Copiar codigo
          </button>

          <div className="overflow-menu-divider" />

          <p className="overflow-menu-section-label">Vista</p>
          <button
            className="overflow-menu-item"
            type="button"
            onClick={() => {
              window.dispatchEvent(new Event("uml:zoom-selection"));
              closeMenu();
            }}
          >
            <Maximize2 size={15} />
            Zoom seleccion
          </button>
          <button
            className="overflow-menu-item"
            type="button"
            onClick={() => {
              onToggleLeftPanel();
              closeMenu();
            }}
          >
            <PanelLeft size={15} />
            {isLeftPanelOpen ? "Ocultar panel izquierdo" : "Mostrar panel izquierdo"}
          </button>
          <button
            className="overflow-menu-item"
            type="button"
            onClick={() => {
              onToggleProperties();
              closeMenu();
            }}
          >
            <PanelRight size={15} />
            {isPropertiesPanelOpen ? "Ocultar propiedades" : "Mostrar propiedades"}
          </button>
          <button
            className="overflow-menu-item"
            type="button"
            onClick={() => {
              onEnterPresentation();
              closeMenu();
            }}
          >
            <Presentation size={15} />
            Presentacion
          </button>
          <button
            className="overflow-menu-item"
            type="button"
            onClick={() => {
              onToggleTheme();
              closeMenu();
            }}
          >
            {isDarkTheme ? <Sun size={15} /> : <Moon size={15} />}
            {isDarkTheme ? "Tema claro" : "Tema oscuro"}
          </button>

          <div className="overflow-menu-divider" />

          <p className="overflow-menu-section-label">Exportar</p>
          <button
            className="overflow-menu-item"
            type="button"
            onClick={() => setIsExportOpen((value) => !value)}
          >
            <Download size={15} />
            {isExportOpen ? "Ocultar opciones" : "Opciones de exportacion"}
          </button>
          {isExportOpen && (
            <div style={{ display: "grid", gap: 8, padding: "4px 8px 8px" }}>
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
              <button
                className="toolbar-button full"
                type="button"
                onClick={() => {
                  exportProject();
                  closeMenu();
                }}
              >
                <FileJson size={16} />
                Descargar proyecto JSON
              </button>
            </div>
          )}

          <div className="overflow-menu-divider" />

          <button
            className="overflow-menu-item danger"
            type="button"
            onClick={() => {
              clearCanvas();
              closeMenu();
            }}
          >
            <Eraser size={15} />
            Limpiar
          </button>
        </div>
      )}
    </div>
  );
}
