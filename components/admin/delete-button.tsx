"use client";

import { Trash2 } from "lucide-react";

export function DeleteButton({
  action,
  hidden,
  confirmText = "Delete this item? This cannot be undone.",
  label,
}: {
  action: (formData: FormData) => void | Promise<void>;
  hidden: Record<string, string>;
  confirmText?: string;
  label?: string;
}) {
  return (
    <form
      action={action}
      onSubmit={(e) => {
        if (!window.confirm(confirmText)) e.preventDefault();
      }}
    >
      {Object.entries(hidden).map(([k, v]) => (
        <input key={k} type="hidden" name={k} value={v} />
      ))}
      <button
        type="submit"
        className="inline-flex items-center gap-1 rounded-lg px-2.5 py-1.5 text-xs font-medium text-muted transition hover:bg-accent-soft hover:text-accent"
      >
        <Trash2 className="h-3.5 w-3.5" />
        {label ?? "Delete"}
      </button>
    </form>
  );
}
