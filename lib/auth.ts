import "server-only";
import { cookies } from "next/headers";
import { SESSION_COOKIE, signSession, verifySession } from "./auth-token";
import { env } from "./env";

/** Constant-time password check against ADMIN_PASSWORD. */
export async function verifyPassword(input: string): Promise<boolean> {
  const expected = env.adminPassword;
  if (!expected) return false;
  const { timingSafeEqual } = await import("node:crypto");
  const a = Buffer.from(String(input));
  const b = Buffer.from(expected);
  if (a.length !== b.length) {
    timingSafeEqual(a, a); // burn comparable time
    return false;
  }
  return timingSafeEqual(a, b);
}

export async function startSession(): Promise<void> {
  const token = await signSession();
  const store = await cookies();
  store.set(SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });
}

export async function endSession(): Promise<void> {
  const store = await cookies();
  store.delete(SESSION_COOKIE);
}

/** Whether the current request carries a valid admin session cookie. */
export async function isAdmin(): Promise<boolean> {
  const store = await cookies();
  return verifySession(store.get(SESSION_COOKIE)?.value);
}
