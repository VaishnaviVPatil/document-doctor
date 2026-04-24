import type { FileValidationRules } from "@/data/checklists";

export type FileValidationResult =
  | { ok: true }
  | { ok: false; errors: string[] };

const ASPECT_TOLERANCE = 0.02;

function mimeMatches(fileType: string, patterns: readonly string[]): boolean {
  if (!fileType) return false;
  return patterns.some((pattern) => {
    if (pattern === fileType) return true;
    if (pattern.endsWith("/*")) {
      const prefix = pattern.slice(0, -1);
      return fileType.startsWith(prefix);
    }
    return false;
  });
}

function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

async function readImageDimensions(
  file: File
): Promise<{ width: number; height: number } | null> {
  if (!file.type.startsWith("image/")) return null;
  if (typeof window === "undefined") return null;

  const url = URL.createObjectURL(file);
  try {
    const dims = await new Promise<{ width: number; height: number } | null>((resolve) => {
      const img = new Image();
      img.onload = () => resolve({ width: img.naturalWidth, height: img.naturalHeight });
      img.onerror = () => resolve(null);
      img.src = url;
    });
    return dims;
  } finally {
    URL.revokeObjectURL(url);
  }
}

export async function validateFile(
  file: File,
  rules: FileValidationRules | undefined
): Promise<FileValidationResult> {
  if (!rules) return { ok: true };
  const errors: string[] = [];

  if (rules.minBytes && file.size < rules.minBytes) {
    errors.push(
      `File is ${formatBytes(file.size)}. Minimum required is ${formatBytes(rules.minBytes)}.`
    );
  }

  if (rules.maxBytes && file.size > rules.maxBytes) {
    errors.push(
      `File is ${formatBytes(file.size)}. Max allowed is ${formatBytes(rules.maxBytes)}.`
    );
  }

  if (rules.mimeTypes && rules.mimeTypes.length > 0) {
    if (!mimeMatches(file.type, rules.mimeTypes)) {
      errors.push(
        `File type "${file.type || "unknown"}" is not accepted. Allowed: ${rules.mimeTypes.join(", ")}.`
      );
    }
  }

  if (rules.image && file.type.startsWith("image/")) {
    const dims = await readImageDimensions(file);
    if (!dims) {
      errors.push("Could not read image dimensions. Try a different file.");
    } else {
      const { width, height } = dims;
      const img = rules.image;
      if (img.minWidth && width < img.minWidth)
        errors.push(`Image width is ${width}px; minimum is ${img.minWidth}px.`);
      if (img.minHeight && height < img.minHeight)
        errors.push(`Image height is ${height}px; minimum is ${img.minHeight}px.`);
      if (img.maxWidth && width > img.maxWidth)
        errors.push(`Image width is ${width}px; maximum is ${img.maxWidth}px.`);
      if (img.maxHeight && height > img.maxHeight)
        errors.push(`Image height is ${height}px; maximum is ${img.maxHeight}px.`);
      if (img.aspectRatio) {
        const actual = width / height;
        const delta = Math.abs(actual - img.aspectRatio) / img.aspectRatio;
        if (delta > ASPECT_TOLERANCE) {
          const expected = img.description ?? `${img.aspectRatio.toFixed(2)}:1`;
          errors.push(
            `Image aspect ratio is ${actual.toFixed(2)}:1; required ${expected}.`
          );
        }
      }
    }
  }

  return errors.length === 0 ? { ok: true } : { ok: false, errors };
}
