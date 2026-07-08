"use client";

import { useActionState } from "react";
import { Lock, Loader2, AlertCircle } from "lucide-react";
import { login, type LoginState } from "@/lib/actions/auth";

export function LoginForm({ next }: { next: string }) {
  const [state, action, pending] = useActionState<LoginState, FormData>(login, {});

  return (
    <form action={action} className="w-full max-w-sm rounded-2xl border border-line bg-surface p-8 shadow-sm">
      <div className="mb-6 flex flex-col items-center text-center">
        <div className="mb-3 grid h-12 w-12 place-items-center rounded-xl bg-accent text-white">
          <Lock className="h-6 w-6" />
        </div>
        <h1 className="font-serif text-2xl font-semibold text-ink">Admin access</h1>
        <p className="mt-1 text-sm text-muted">Enter the admin password to continue.</p>
      </div>

      {state.error && (
        <div className="mb-4 flex items-start gap-2 rounded-xl border border-accent-ring bg-accent-soft px-4 py-3 text-sm text-accent-dark">
          <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
          <span>{state.error}</span>
        </div>
      )}

      <input type="hidden" name="next" value={next} />
      <label htmlFor="password" className="text-sm font-medium text-ink-soft">
        Password
      </label>
      <input
        id="password"
        name="password"
        type="password"
        autoFocus
        autoComplete="current-password"
        className="mt-1.5 w-full rounded-xl border border-line bg-paper px-3.5 py-2.5 text-sm text-ink outline-none transition focus:border-accent"
      />

      <button
        type="submit"
        disabled={pending}
        className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-full bg-accent px-5 py-3 text-sm font-semibold text-white transition hover:bg-accent-dark disabled:opacity-60"
      >
        {pending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Lock className="h-4 w-4" />}
        {pending ? "Verifying…" : "Sign in"}
      </button>
    </form>
  );
}
