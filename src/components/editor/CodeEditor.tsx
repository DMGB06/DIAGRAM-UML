import { useEffect, useRef } from "react";
import * as monaco from "monaco-editor";

import { useDiagramStore } from "../../store/useDiagramStore";

export function CodeEditor() {
  const hostRef = useRef<HTMLDivElement | null>(null);
  const editorRef = useRef<monaco.editor.IStandaloneCodeEditor | null>(null);
  const source = useDiagramStore((state) => state.source);
  const setSource = useDiagramStore((state) => state.setSource);
  const errors = useDiagramStore((state) => state.errors);

  useEffect(() => {
    if (!hostRef.current || editorRef.current) {
      return;
    }

    editorRef.current = monaco.editor.create(hostRef.current, {
      value: source,
      language: "text",
      theme: "vs-dark",
      minimap: { enabled: false },
      fontSize: 13,
      lineNumbers: "on",
      automaticLayout: true,
      wordWrap: "on",
    });

    const subscription = editorRef.current.onDidChangeModelContent(() => {
      setSource(editorRef.current?.getValue() ?? "");
    });

    return () => {
      subscription.dispose();
      editorRef.current?.dispose();
      editorRef.current = null;
    };
  }, [setSource, source]);

  return (
    <div className="flex h-full flex-col">
      <div className="border-b border-slate-800 p-3">
        <h2 className="text-sm font-semibold">Codigo UML</h2>
        <p className="mt-1 text-xs text-slate-400">MVP inicial para diagramas de clases.</p>
      </div>
      <div ref={hostRef} className="min-h-0 flex-1" />
      {errors.length > 0 && (
        <div className="max-h-32 overflow-auto border-t border-amber-500/30 bg-amber-950/30 p-3 text-xs text-amber-100">
          {errors.map((error) => (
            <p key={error}>{error}</p>
          ))}
        </div>
      )}
    </div>
  );
}
