import type { Edge, Node } from "@xyflow/react";

import type { DiagramEdgeData, DiagramNodeData } from "../diagram/types";
import { createProjectSnapshot } from "../project/projectService";
import type { DiagramType } from "../diagram/types";

export type ExportFormat = "png" | "svg" | "pdf" | "json";
export type ExportBackground = "current" | "white" | "dark" | "transparent";
export type ExportScope = "all" | "selection";
export type ExportResolution = "standard" | "high";

export interface ExportDiagramOptions {
  format: ExportFormat;
  background: ExportBackground;
  scope: ExportScope;
  resolution: ExportResolution;
  canvasBackground: "light" | "dark";
  diagramType: DiagramType;
  source: string;
  nodes: Array<Node<DiagramNodeData>>;
  edges: Array<Edge<DiagramEdgeData>>;
  selectedNodeIds: string[];
  selectedEdgeId?: string;
}

interface ExportNode extends Node<DiagramNodeData> {
  width: number;
  height: number;
}

const padding = 56;

export async function exportDiagram(options: ExportDiagramOptions) {
  if (options.format === "json") {
    exportProjectJson(options);
    return;
  }

  const svg = createDiagramSvg(options);
  const filename = `uml-diagram.${options.format}`;

  if (options.format === "svg") {
    downloadBlob(new Blob([svg], { type: "image/svg+xml;charset=utf-8" }), filename);
    return;
  }

  const png = await svgToPng(svg, options.resolution === "high" ? 2 : 1);

  if (options.format === "png") {
    downloadDataUrl(png, filename);
    return;
  }

  const image = await loadImage(png);
  const { default: jsPDF } = await import("jspdf");
  const pdf = new jsPDF({
    orientation: image.width >= image.height ? "landscape" : "portrait",
    unit: "px",
    format: [image.width, image.height],
  });

  pdf.addImage(png, "PNG", 0, 0, image.width, image.height);
  pdf.save(filename);
}

export function createDiagramSvg(options: ExportDiagramOptions) {
  const selectedIds = new Set(options.selectedNodeIds);
  const hasSelection = options.scope === "selection" && selectedIds.size > 0;
  const nodes = options.nodes
    .filter((node) => !hasSelection || selectedIds.has(node.id))
    .map((node) => ({ ...node, ...getNodeSize(node) }));
  const nodeIds = new Set(nodes.map((node) => node.id));
  const edges = options.edges.filter((edge) => {
    if (hasSelection) {
      return nodeIds.has(edge.source) && nodeIds.has(edge.target);
    }

    return true;
  });

  const bounds = getBounds(nodes);
  const width = Math.max(320, bounds.width + padding * 2);
  const height = Math.max(240, bounds.height + padding * 2);
  const offsetX = padding - bounds.x;
  const offsetY = padding - bounds.y;
  const background = resolveBackground(options.background, options.canvasBackground);
  const gridColor = background === "#0f172a" ? "#334155" : "#cbd5e1";

  return [
    `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">`,
    "<defs>",
    `<marker id="arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="8" markerHeight="8" orient="auto-start-reverse"><path d="M 0 0 L 10 5 L 0 10 z" fill="#334155"/></marker>`,
    `<pattern id="grid" width="24" height="24" patternUnits="userSpaceOnUse"><circle cx="1" cy="1" r="1" fill="${gridColor}"/></pattern>`,
    "</defs>",
    background ? `<rect width="100%" height="100%" fill="${background}"/>` : "",
    `<rect width="100%" height="100%" fill="url(#grid)" opacity="0.55"/>`,
    ...edges.map((edge) => renderEdge(edge, nodes, offsetX, offsetY)),
    ...nodes.map((node) => renderNode(node, offsetX, offsetY)),
    "</svg>",
  ].join("");
}

function exportProjectJson(options: ExportDiagramOptions) {
  const selectedIds = new Set(options.selectedNodeIds);
  const hasSelection = options.scope === "selection" && selectedIds.size > 0;
  const nodes = options.nodes.filter((node) => !hasSelection || selectedIds.has(node.id));
  const nodeIds = new Set(nodes.map((node) => node.id));
  const edges = options.edges.filter(
    (edge) => !hasSelection || (nodeIds.has(edge.source) && nodeIds.has(edge.target)),
  );
  const payload = JSON.stringify(
    createProjectSnapshot({
      diagramType: options.diagramType,
      source: options.source,
      nodes,
      edges,
      canvasBackground: options.canvasBackground,
    }),
    null,
    2,
  );

  downloadBlob(new Blob([payload], { type: "application/json" }), "uml-visual-project.json");
}

function renderNode(node: ExportNode, offsetX: number, offsetY: number) {
  const x = node.position.x + offsetX;
  const y = node.position.y + offsetY;
  const fill = node.data.style.fill;
  const stroke = node.data.style.stroke;
  const text = escapeXml(node.data.style.text);
  const label = escapeXml(node.data.label);

  if (node.data.kind === "activity-decision") {
    const points = [
      `${x + node.width / 2},${y}`,
      `${x + node.width},${y + node.height / 2}`,
      `${x + node.width / 2},${y + node.height}`,
      `${x},${y + node.height / 2}`,
    ].join(" ");

    return `<g><polygon points="${points}" fill="${fill}" stroke="${stroke}" stroke-width="2"/><text x="${x + node.width / 2}" y="${y + node.height / 2 + 5}" text-anchor="middle" font-family="Arial" font-size="13" fill="${text}">${label}</text></g>`;
  }

  if (node.data.kind === "activity-start" || node.data.kind === "activity-end") {
    return `<g><circle cx="${x + node.width / 2}" cy="${y + node.height / 2}" r="${Math.min(node.width, node.height) / 2 - 2}" fill="${fill}" stroke="${stroke}" stroke-width="2"/><text x="${x + node.width / 2}" y="${y + node.height + 20}" text-anchor="middle" font-family="Arial" font-size="12" fill="${text}">${label}</text></g>`;
  }

  if (node.data.kind === "usecase") {
    return `<g><ellipse cx="${x + node.width / 2}" cy="${y + node.height / 2}" rx="${node.width / 2}" ry="${node.height / 2}" fill="${fill}" stroke="${stroke}" stroke-width="2"/><text x="${x + node.width / 2}" y="${y + node.height / 2 + 5}" text-anchor="middle" font-family="Arial" font-size="13" fill="${text}">${label}</text></g>`;
  }

  if (node.data.kind === "actor") {
    const cx = x + node.width / 2;
    return `<g stroke="${stroke}" stroke-width="2" fill="none"><circle cx="${cx}" cy="${y + 18}" r="14" fill="${fill}"/><path d="M ${cx} ${y + 32} L ${cx} ${y + 78} M ${x + 20} ${y + 48} L ${x + node.width - 20} ${y + 48} M ${cx} ${y + 78} L ${x + 24} ${y + 112} M ${cx} ${y + 78} L ${x + node.width - 24} ${y + 112}"/><text x="${cx}" y="${y + 130}" text-anchor="middle" font-family="Arial" font-size="13" fill="${text}" stroke="none">${label}</text></g>`;
  }

  const isNote = node.data.kind === "note";
  const radius = isNote ? 0 : 8;
  const stereotype =
    node.data.kind === "interface"
      ? "&lt;&lt;interface&gt;&gt;"
      : node.data.kind === "enum"
        ? "&lt;&lt;enum&gt;&gt;"
        : "";
  const stereotypeText = stereotype
    ? `<text x="${x + node.width / 2}" y="${y + 25}" text-anchor="middle" font-family="Arial" font-size="11" fill="${text}">${stereotype}</text>`
    : "";
  const labelY = stereotype ? y + 47 : y + node.height / 2 + 5;

  return `<g><rect x="${x}" y="${y}" width="${node.width}" height="${node.height}" rx="${radius}" fill="${fill}" stroke="${stroke}" stroke-width="2"/>${stereotypeText}<text x="${x + node.width / 2}" y="${labelY}" text-anchor="middle" font-family="Arial" font-size="14" font-weight="700" fill="${text}">${label}</text></g>`;
}

function renderEdge(
  edge: Edge<DiagramEdgeData>,
  nodes: ExportNode[],
  offsetX: number,
  offsetY: number,
) {
  const source = nodes.find((node) => node.id === edge.source);
  const target = nodes.find((node) => node.id === edge.target);

  if (!source || !target) {
    return "";
  }

  const start = {
    x: source.position.x + source.width / 2 + offsetX,
    y: source.position.y + source.height / 2 + offsetY,
  };
  const end = {
    x: target.position.x + target.width / 2 + offsetX,
    y: target.position.y + target.height / 2 + offsetY,
  };
  const direction = edge.data?.arrowDirection ?? "forward";
  const markerStart = direction === "reverse" ? ' marker-start="url(#arrow)"' : "";
  const markerEnd = direction === "forward" ? ' marker-end="url(#arrow)"' : "";
  const path =
    edge.data?.lineStyle === "step"
      ? `M ${start.x} ${start.y} L ${(start.x + end.x) / 2} ${start.y} L ${(start.x + end.x) / 2} ${end.y} L ${end.x} ${end.y}`
      : edge.data?.lineStyle === "straight"
        ? `M ${start.x} ${start.y} L ${end.x} ${end.y}`
        : `M ${start.x} ${start.y} C ${(start.x + end.x) / 2} ${start.y - (edge.data?.curveOffset ?? 0)}, ${(start.x + end.x) / 2} ${end.y + (edge.data?.curveOffset ?? 0)}, ${end.x} ${end.y}`;
  const label = edge.data?.label
    ? `<text x="${(start.x + end.x) / 2}" y="${(start.y + end.y) / 2 - 8}" text-anchor="middle" font-family="Arial" font-size="12" fill="#334155">${escapeXml(edge.data.label)}</text>`
    : "";

  return `<g><path d="${path}" fill="none" stroke="#334155" stroke-width="2"${markerStart}${markerEnd}/>${label}</g>`;
}

function getNodeSize(node: Node<DiagramNodeData>) {
  if (node.data.kind === "activity-start" || node.data.kind === "activity-end")
    return { width: 64, height: 64 };
  if (node.data.kind === "activity-decision") return { width: 132, height: 92 };
  if (node.data.kind === "activity") return { width: 180, height: 64 };
  if (node.data.kind === "actor") return { width: 104, height: 140 };
  if (node.data.kind === "usecase") return { width: 184, height: 86 };
  if (node.data.kind === "system-boundary") return { width: 240, height: 170 };
  if (node.data.kind === "participant") return { width: 170, height: 72 };
  return { width: 190, height: 92 };
}

function getBounds(nodes: ExportNode[]) {
  if (!nodes.length) {
    return { x: 0, y: 0, width: 0, height: 0 };
  }

  const minX = Math.min(...nodes.map((node) => node.position.x));
  const minY = Math.min(...nodes.map((node) => node.position.y));
  const maxX = Math.max(...nodes.map((node) => node.position.x + node.width));
  const maxY = Math.max(...nodes.map((node) => node.position.y + node.height));

  return { x: minX, y: minY, width: maxX - minX, height: maxY - minY };
}

function resolveBackground(background: ExportBackground, canvasBackground: "light" | "dark") {
  if (background === "transparent") return "";
  if (background === "white") return "#ffffff";
  if (background === "dark") return "#0f172a";
  return canvasBackground === "light" ? "#f8fafc" : "#0f172a";
}

function svgToPng(svg: string, scale: number) {
  const svgUrl = URL.createObjectURL(new Blob([svg], { type: "image/svg+xml;charset=utf-8" }));

  return loadImage(svgUrl).then((image) => {
    const canvas = document.createElement("canvas");
    canvas.width = image.width * scale;
    canvas.height = image.height * scale;
    const context = canvas.getContext("2d");

    if (!context) {
      URL.revokeObjectURL(svgUrl);
      throw new Error("No se pudo preparar el canvas de exportacion.");
    }

    context.drawImage(image, 0, 0, canvas.width, canvas.height);
    URL.revokeObjectURL(svgUrl);
    return canvas.toDataURL("image/png");
  });
}

function loadImage(src: string) {
  return new Promise<HTMLImageElement>((resolve, reject) => {
    const image = new Image();
    image.onload = () => resolve(image);
    image.onerror = reject;
    image.src = src;
  });
}

function downloadBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  downloadDataUrl(url, filename);
  URL.revokeObjectURL(url);
}

function downloadDataUrl(url: string, filename: string) {
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  link.click();
}

function escapeXml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}
