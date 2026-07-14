"use client";

import { useRef, useState } from "react";
import { Upload, Loader2, X } from "lucide-react";

/**
 * Cover image picker: paste a URL *or* upload a local file straight to the
 * Supabase 'media' bucket (via /api/admin/upload — same endpoint the rich
 * editor uses for inline images). The resolved URL is submitted as
 * `cover_image` so the existing post server action is unchanged.
 */
export function CoverImageField({
  defaultValue,
  error,
}: {
  defaultValue?: string | null;
  error?: string;
}) {
  const [url, setUrl] = useState(defaultValue ?? "");
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const onFileSelected = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    setUploading(true);
    setUploadError(null);
    try {
      const fd = new FormData();
      fd.append("file", file);
      const res = await fetch("/api/admin/upload", { method: "POST", body: fd });
      const json = await res.json();
      if (res.ok && json.url) {
        setUrl(json.url);
      } else {
        setUploadError(json.error || "Upload failed.");
      }
    } catch {
      setUploadError("Upload failed. Please try again.");
    } finally {
      setUploading(false);
    }
  };

  const inputCls =
    "w-full rounded-xl border border-line bg-paper px-3.5 py-2.5 text-sm text-ink outline-none transition focus:border-accent aria-[invalid=true]:border-accent";

  return (
    <div>
      <label htmlFor="cover_image" className="text-sm font-medium text-ink-soft">
        Cover image
      </label>

      {/* Submitted value — always a URL (typed or uploaded). */}
      <div className="mt-1.5 flex gap-2">
        <input
          id="cover_image"
          name="cover_image"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          aria-invalid={!!error}
          placeholder="https://…/cover.jpg  — or upload a file →"
          className={inputCls}
        />
        <button
          type="button"
          onClick={() => fileRef.current?.click()}
          disabled={uploading}
          className="inline-flex shrink-0 items-center gap-2 rounded-xl border border-line bg-band px-4 text-sm font-medium text-ink-soft transition hover:bg-surface hover:text-ink disabled:opacity-60"
        >
          {uploading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Upload className="h-4 w-4" />
          )}
          {uploading ? "Uploading…" : "Upload"}
        </button>
        <input
          ref={fileRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={onFileSelected}
        />
      </div>

      {uploadError ? (
        <p className="mt-1 text-xs text-accent">{uploadError}</p>
      ) : error ? (
        <p className="mt-1 text-xs text-accent">{error}</p>
      ) : (
        <p className="mt-1 text-xs text-faint">
          Paste an image URL, or upload a file from your computer (max 8 MB).
        </p>
      )}

      {/* Live preview with a quick clear button. */}
      {url && (
        <div className="mt-3 flex items-start gap-3">
          <div className="relative h-20 w-32 shrink-0 overflow-hidden rounded-lg border border-line bg-band">
            {/* Use a plain <img>: cover URLs come from arbitrary hosts. */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={url}
              alt="Cover preview"
              className="h-full w-full object-cover"
            />
          </div>
          <button
            type="button"
            onClick={() => setUrl("")}
            className="inline-flex items-center gap-1 rounded-lg border border-line px-2.5 py-1 text-xs font-medium text-muted transition hover:bg-band hover:text-ink"
          >
            <X className="h-3 w-3" /> Remove
          </button>
        </div>
      )}
    </div>
  );
}
