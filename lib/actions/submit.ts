"use server";

import { submissionInput } from "@/lib/validation";
import { hasServiceRole } from "@/lib/env";
import { supabaseAdmin } from "@/lib/supabase/admin";

export type SubmitState = {
  ok: boolean;
  message?: string;
  error?: string;
  fieldErrors?: Record<string, string>;
};

export async function submitSite(
  _prev: SubmitState,
  formData: FormData,
): Promise<SubmitState> {
  // Honeypot: real users never fill a hidden "website" field.
  if (String(formData.get("website") ?? "").length > 0) {
    return { ok: true, message: "Thanks! Your submission is in the review queue." };
  }

  const parsed = submissionInput.safeParse({
    outlet_name: formData.get("outlet_name"),
    url: formData.get("url"),
    category_suggestion: formData.get("category_suggestion") ?? "",
    submitter_email: formData.get("submitter_email") ?? "",
    notes: formData.get("notes") ?? "",
  });

  if (!parsed.success) {
    const fieldErrors: Record<string, string> = {};
    for (const issue of parsed.error.issues) {
      const key = issue.path[0];
      if (typeof key === "string" && !fieldErrors[key]) {
        fieldErrors[key] = issue.message;
      }
    }
    return { ok: false, error: "Please fix the highlighted fields.", fieldErrors };
  }

  const data = parsed.data;

  if (hasServiceRole()) {
    try {
      const { error } = await supabaseAdmin()
        .from("submissions")
        .insert({
          outlet_name: data.outlet_name,
          url: data.url,
          category_suggestion: data.category_suggestion || null,
          submitter_email: data.submitter_email || null,
          notes: data.notes || null,
          status: "pending",
        });
      if (error) throw error;
    } catch (e) {
      console.error("[submit] insert failed:", e);
      return {
        ok: false,
        error: "We couldn't save your submission right now. Please try again shortly.",
      };
    }
  } else {
    // No DB configured (fallback/demo mode) — accept gracefully.
    console.info("[submit] received (no DB configured):", data.outlet_name, data.url);
  }

  return {
    ok: true,
    message:
      "Thanks! Your site has been added to the review queue. We'll publish it after a quick check.",
  };
}
