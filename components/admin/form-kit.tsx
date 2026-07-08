"use client";

import Link from "next/link";
import { AlertCircle, Loader2 } from "lucide-react";

export function ErrorBanner({ message }: { message?: string }) {
  if (!message) return null;
  return (
    <div className="mb-5 flex items-start gap-2 rounded-xl border border-accent-ring bg-accent-soft px-4 py-3 text-sm text-accent-dark">
      <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
      <span>{message}</span>
    </div>
  );
}

const inputCls =
  "mt-1.5 w-full rounded-xl border border-line bg-paper px-3.5 py-2.5 text-sm text-ink outline-none transition focus:border-accent aria-[invalid=true]:border-accent";

export function Field({
  label,
  name,
  defaultValue,
  error,
  required,
  type = "text",
  placeholder,
  hint,
}: {
  label: string;
  name: string;
  defaultValue?: string | number | null;
  error?: string;
  required?: boolean;
  type?: string;
  placeholder?: string;
  hint?: string;
}) {
  return (
    <div>
      <label htmlFor={name} className="text-sm font-medium text-ink-soft">
        {label} {required && <span className="text-accent">*</span>}
      </label>
      <input
        id={name}
        name={name}
        type={type}
        defaultValue={defaultValue ?? ""}
        required={required}
        placeholder={placeholder}
        aria-invalid={!!error}
        className={inputCls}
      />
      {hint && !error && <p className="mt-1 text-xs text-faint">{hint}</p>}
      {error && <p className="mt-1 text-xs text-accent">{error}</p>}
    </div>
  );
}

export function TextArea({
  label,
  name,
  defaultValue,
  error,
  rows = 4,
  placeholder,
  mono,
}: {
  label: string;
  name: string;
  defaultValue?: string | null;
  error?: string;
  rows?: number;
  placeholder?: string;
  mono?: boolean;
}) {
  return (
    <div>
      <label htmlFor={name} className="text-sm font-medium text-ink-soft">
        {label}
      </label>
      <textarea
        id={name}
        name={name}
        rows={rows}
        defaultValue={defaultValue ?? ""}
        placeholder={placeholder}
        className={`${inputCls} resize-y ${mono ? "font-mono text-[13px]" : ""}`}
      />
      {error && <p className="mt-1 text-xs text-accent">{error}</p>}
    </div>
  );
}

export function Select({
  label,
  name,
  defaultValue,
  options,
  error,
  required,
}: {
  label: string;
  name: string;
  defaultValue?: string;
  options: { value: string; label: string }[];
  error?: string;
  required?: boolean;
}) {
  return (
    <div>
      <label htmlFor={name} className="text-sm font-medium text-ink-soft">
        {label} {required && <span className="text-accent">*</span>}
      </label>
      <select
        id={name}
        name={name}
        defaultValue={defaultValue ?? ""}
        className={inputCls}
      >
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
      {error && <p className="mt-1 text-xs text-accent">{error}</p>}
    </div>
  );
}

export function Checkbox({
  label,
  name,
  defaultChecked,
}: {
  label: string;
  name: string;
  defaultChecked?: boolean;
}) {
  return (
    <label className="flex cursor-pointer items-center gap-2.5 rounded-xl border border-line bg-paper px-3.5 py-2.5">
      <input
        type="checkbox"
        name={name}
        defaultChecked={defaultChecked}
        className="h-4 w-4 accent-[var(--color-accent)]"
      />
      <span className="text-sm text-ink">{label}</span>
    </label>
  );
}

export function SubmitBar({
  pending,
  label = "Save",
  cancelHref,
}: {
  pending: boolean;
  label?: string;
  cancelHref: string;
}) {
  return (
    <div className="mt-7 flex items-center gap-3">
      <button
        type="submit"
        disabled={pending}
        className="inline-flex items-center gap-2 rounded-full bg-accent px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-accent-dark disabled:opacity-60"
      >
        {pending && <Loader2 className="h-4 w-4 animate-spin" />}
        {pending ? "Saving…" : label}
      </button>
      <Link
        href={cancelHref}
        className="rounded-full border border-line px-5 py-2.5 text-sm font-medium text-ink-soft hover:bg-band"
      >
        Cancel
      </Link>
    </div>
  );
}
