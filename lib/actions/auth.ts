"use server";

import { redirect } from "next/navigation";
import { verifyPassword, startSession, endSession } from "@/lib/auth";
import { loginInput } from "@/lib/validation";

export type LoginState = { error?: string };

export async function login(
  _prev: LoginState,
  formData: FormData,
): Promise<LoginState> {
  const parsed = loginInput.safeParse({ password: formData.get("password") });
  if (!parsed.success) return { error: "Password is required." };

  const ok = await verifyPassword(parsed.data.password);
  if (!ok) return { error: "Incorrect password. Please try again." };

  await startSession();

  const next = String(formData.get("next") ?? "/admin");
  redirect(next.startsWith("/admin") ? next : "/admin");
}

export async function logout() {
  await endSession();
  redirect("/admin/login");
}
