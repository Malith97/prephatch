import fs from "node:fs";

export function readMdxFile(filepath: string): { title: string; summary: string; status: string } & Record<string, unknown> & { body: string } {
  const raw = fs.readFileSync(filepath, "utf8");

  const frontmatterMatch = raw.match(/^---\r?\n([\s\S]*?)\r?\n---(?:\r?\n|$)/);
  const yamlBlock = frontmatterMatch?.[1] ?? "";
  const body = frontmatterMatch ? raw.slice(frontmatterMatch[0].length) : raw;

  const metadata: Record<string, unknown> = {};
  
  if (yamlBlock) {
    // Simple YAML-like parser for key-value pairs on separate lines
    const lines = yamlBlock.split("\n");
    for (const line of lines) {
      const trimmedLine = line.trim();
      
      // Skip empty lines
      if (!trimmedLine) continue;
      
      // Check if this is a content section header (starts with # or similar markdown syntax)
      if (/^#/.test(trimmedLine)) {
        break;
      }

      // Parse key: value pairs, handling quoted values and inline comments
      const colonIndex = trimmedLine.indexOf(":");
      if (colonIndex === -1) continue;

      const key = trimmedLine.substring(0, colonIndex).trim();
      let value = trimmedLine.substring(colonIndex + 1).trim();

      // Remove trailing comment markers (# or //) from the value
      for (const marker of ["#", "//"]) {
        const idx = value.indexOf(marker);
        if (idx !== -1) {
          value = value.substring(0, idx).trim();
          break;
        }
      }

        if (value.length >= 2) {
          const firstCharacter = value[0];
          const lastCharacter = value[value.length - 1];
          if (
            (firstCharacter === '"' && lastCharacter === '"') ||
            (firstCharacter === "'" && lastCharacter === "'")
          ) {
            value = value.slice(1, -1);
          }
        }

      metadata[key] = value || "";
    }
  }

  const result: Record<string, unknown> & { body: string } = {
    ...metadata,
    body: body.trim(),
  };

  return {
    ...result,
    title: typeof result.title === "string" ? result.title : "",
    summary: typeof result.summary === "string" ? result.summary : "",
    status: typeof result.status === "string" ? result.status : "",
  };
}
