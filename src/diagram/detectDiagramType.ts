export type DetectableDiagramType = "class" | "sequence";

export function detectDiagramType(source: string): DetectableDiagramType | null {
  const lines = source
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter((line) => line && !line.startsWith("'") && !line.startsWith("@"));

  const hasClassKeyword = lines.some((line) => /^(class|interface|enum)\b/.test(line));
  const hasParticipantKeyword = lines.some((line) => /^participant\b/.test(line));

  if (hasClassKeyword && !hasParticipantKeyword) {
    return "class";
  }

  if (hasParticipantKeyword && !hasClassKeyword) {
    return "sequence";
  }

  if (hasClassKeyword && hasParticipantKeyword) {
    return null;
  }

  const hasClassArrow = lines.some(
    (line) =>
      line.includes("--|>") ||
      line.includes("..>") ||
      line.includes("*--") ||
      line.includes("o--"),
  );

  if (hasClassArrow) {
    return "class";
  }

  const hasSequenceArrow = lines.some(
    (line) => line.includes("-->>") || /^[A-Za-z_]\w*\s+->\s+/.test(line),
  );

  if (hasSequenceArrow) {
    return "sequence";
  }

  return null;
}
