import { describe, expect, it } from "vitest";

import { useDiagramStore } from "../../src/store/useDiagramStore";

describe("useDiagramStore phase 4 local project import/export", () => {
  it("imports valid project JSON preserving positions, colors and edges", () => {
    const json = JSON.stringify({
      version: 1,
      name: "Proyecto UML",
      source: "@startuml\nclass Cliente\n@enduml",
      canvasBackground: "dark",
      nodes: [
        {
          id: "cliente",
          type: "umlClass",
          position: { x: 321, y: 123 },
          data: {
            label: "Cliente",
            kind: "class",
            style: {
              fill: "#ffffff",
              stroke: "#111827",
              text: "#334155",
            },
          },
        },
      ],
      edges: [
        {
          id: "edge-1",
          source: "cliente",
          target: "cliente",
          sourceHandle: "right-source",
          targetHandle: "left-target",
          type: "umlEditable",
          data: {
            relation: "association",
            lineStyle: "step",
            curveOffset: 0,
            arrowDirection: "forward",
          },
        },
      ],
    });

    const project = useDiagramStore.getState().importProjectJson(json);
    const state = useDiagramStore.getState();

    expect(project).toBeDefined();
    expect(state.nodes[0].position).toEqual({ x: 321, y: 123 });
    expect(state.nodes[0].data.style.fill).toBe("#ffffff");
    expect(state.edges[0].data?.lineStyle).toBe("step");
    expect(state.canvasBackground).toBe("dark");
  });

  it("sets a clear error for invalid project JSON", () => {
    const project = useDiagramStore.getState().importProjectJson('{"source": 1}');

    expect(project).toBeUndefined();
    expect(useDiagramStore.getState().projectError).toBe(
      "El archivo JSON no tiene un formato de proyecto valido.",
    );
  });

  it("creates a clean new project without confirmation when requested", () => {
    useDiagramStore.getState().newProject({ confirm: false });
    const state = useDiagramStore.getState();

    expect(state.nodes).toHaveLength(0);
    expect(state.edges).toHaveLength(0);
    expect(state.canvasBackground).toBe("light");
    expect(state.source).toBe("@startuml\n@enduml");
  });
});
