import { describe, expect, it } from "vitest";

import {
  createProjectSnapshot,
  parseProjectJson,
  serializeProject,
} from "../../src/project/projectService";

describe("projectService", () => {
  const projectInput = {
    diagramType: "class" as const,
    source: "@startuml\nclass Cliente\n@enduml",
    canvasBackground: "light" as const,
    nodes: [
      {
        id: "cliente",
        type: "umlClass",
        position: { x: 240, y: 120 },
        data: {
          label: "Cliente",
          kind: "class" as const,
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
        target: "pedido",
        sourceHandle: "right-source",
        targetHandle: "left-target",
        type: "umlEditable",
        data: {
          relation: "association" as const,
          lineStyle: "curve" as const,
          curveOffset: 90,
          arrowDirection: "forward" as const,
        },
      },
    ],
  };

  it("creates a valid project snapshot", () => {
    const snapshot = createProjectSnapshot(projectInput);

    expect(snapshot.version).toBe(1);
    expect(snapshot.nodes[0].position).toEqual({ x: 240, y: 120 });
    expect(snapshot.nodes[0].data.style.fill).toBe("#ffffff");
    expect(snapshot.edges[0].sourceHandle).toBe("right-source");
  });

  it("serializes and parses project JSON", () => {
    const json = serializeProject(projectInput);
    const parsed = parseProjectJson(json);

    expect(parsed.source).toContain("Cliente");
    expect(parsed.canvasBackground).toBe("light");
    expect(parsed.edges).toHaveLength(1);
  });

  it("rejects invalid project JSON", () => {
    expect(() => parseProjectJson('{"source": 1}')).toThrow();
  });
});
