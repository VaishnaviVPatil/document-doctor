"use client";

import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Loader2, Upload, CheckCircle2, AlertTriangle, XCircle } from "lucide-react";
import { validateFile } from "@/lib/fileValidation";
import type { FileValidationRules } from "@/data/checklists";

export type ValidationResult = {
  status: "pass" | "warn" | "fail" | "unknown";
  reasons: string[];
  citations: string[];
  fileName?: string;
};

type Props = {
  itemLabel: string;
  itemDescription?: string;
  validationHints?: string[];
  officialSourceUrl?: string;
  visaTitle: string;
  accept?: string;
  initial?: ValidationResult;
  validation?: FileValidationRules;
  onResult: (r: ValidationResult) => void;
};

export default function UploadAndValidate({
  itemLabel,
  itemDescription,
  validationHints,
  officialSourceUrl,
  visaTitle,
  accept = "application/pdf,image/*",
  initial,
  validation,
  onResult,
}: Props) {
  const [result, setResult] = useState<ValidationResult | undefined>(initial);
  const [loading, setLoading] = useState(false);
  const [phase, setPhase] = useState<"idle" | "uploading" | "validating">("idle");
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [localErrors, setLocalErrors] = useState<string[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => setResult(initial), [initial]);

  const upload = async (file: File) => {
    setLoading(true);
    setPhase("uploading");
    setProgress(0);
    setError(null);
    setLocalErrors([]);

    const pre = await validateFile(file, validation);
    if (!pre.ok) {
      setLocalErrors(pre.errors);
      setLoading(false);
      setPhase("idle");
      return;
    }
    // Smooth indeterminate-style ramp while we wait on Claude
    const ramp = setInterval(() => {
      setProgress((p) => (p < 90 ? p + 3 : p));
    }, 120);
    try {
      const fd = new FormData();
      fd.append("file", file);
      fd.append("itemLabel", itemLabel);
      fd.append("itemDescription", itemDescription ?? "");
      fd.append("officialSourceUrl", officialSourceUrl ?? "");
      fd.append("visaTitle", visaTitle);
      fd.append("validationHints", JSON.stringify(validationHints ?? []));
      setPhase("validating");
      const res = await fetch("/api/validate", { method: "POST", body: fd });
      const json = (await res.json()) as ValidationResult;
      const withName: ValidationResult = { ...json, fileName: file.name };
      setResult(withName);
      onResult(withName);
      setProgress(100);
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
    } finally {
      clearInterval(ramp);
      setLoading(false);
      setPhase("idle");
    }
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2">
        <input
          ref={inputRef}
          type="file"
          accept={accept}
          className="hidden"
          onChange={(e) => {
            const f = e.target.files?.[0];
            if (f) upload(f);
          }}
        />
        <Button
          type="button"
          variant="outline"
          size="sm"
          disabled={loading}
          onClick={(e) => {
            e.stopPropagation();
            inputRef.current?.click();
          }}
        >
          {loading ? (
            <Loader2 className="mr-1 h-4 w-4 animate-spin" />
          ) : (
            <Upload className="mr-1 h-4 w-4" />
          )}
          {result ? "Replace file" : "Upload & validate"}
        </Button>
        {result && <StatusBadge status={result.status} />}
        {result?.fileName && (
          <span className="truncate text-xs text-muted-foreground">{result.fileName}</span>
        )}
      </div>

      {loading && (
        <div className="space-y-1">
          <Progress value={progress} />
          <p className="text-xs text-muted-foreground">
            {phase === "uploading" ? "Uploading…" : "Claude is validating against the official requirements…"}
          </p>
        </div>
      )}

      {error && <p className="text-xs text-destructive">{error}</p>}

      {localErrors.length > 0 && (
        <div className="rounded-md border border-destructive/40 bg-destructive/5 p-2 text-xs text-destructive">
          <p className="mb-1 font-medium">File doesn&apos;t meet requirements:</p>
          <ul className="ml-1 list-disc pl-4">
            {localErrors.map((e, i) => (
              <li key={i}>{e}</li>
            ))}
          </ul>
        </div>
      )}

      {result && result.reasons.length > 0 && (
        <ul className="ml-1 list-disc space-y-1 pl-4 text-xs text-muted-foreground">
          {result.reasons.map((r, i) => (
            <li key={i}>{r}</li>
          ))}
        </ul>
      )}
      {result && result.citations.length > 0 && (
        <div className="text-xs text-muted-foreground">
          Sources:{" "}
          {result.citations.map((c, i) => (
            <a
              key={i}
              href={c}
              target="_blank"
              rel="noreferrer"
              className="mr-2 underline"
            >
              [{i + 1}]
            </a>
          ))}
        </div>
      )}
    </div>
  );
}

function StatusBadge({ status }: { status: ValidationResult["status"] }) {
  if (status === "pass")
    return (
      <Badge className="bg-green-600 text-white">
        <CheckCircle2 className="mr-1 h-3 w-3" /> Pass
      </Badge>
    );
  if (status === "warn")
    return (
      <Badge className="bg-yellow-500 text-white">
        <AlertTriangle className="mr-1 h-3 w-3" /> Warning
      </Badge>
    );
  if (status === "fail")
    return (
      <Badge variant="destructive">
        <XCircle className="mr-1 h-3 w-3" /> Fail
      </Badge>
    );
  return <Badge variant="secondary">Unknown</Badge>;
}
