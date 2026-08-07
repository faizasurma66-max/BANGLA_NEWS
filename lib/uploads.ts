import "server-only";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { slugify } from "@/lib/seed-data";

/**
 * Image upload helper shared by the account and settings actions.
 *
 * Deliberately NOT in a "use server" module: every export of one of those is
 * reachable as a public POST endpoint, and this function writes to storage. It
 * lives here so it can only be called from server code that has already checked
 * the caller's permissions.
 */

const BUCKET = "media";
const MAX_BYTES = 8 * 1024 * 1024;

export async function uploadImageField(
  formData: FormData,
  field: string,
  folder: string,
): Promise<string | null> {
  const file = formData.get(field);
  if (!(file instanceof File) || file.size === 0) return null;
  if (!file.type.startsWith("image/")) {
    throw new Error("শুধু ছবি ফাইল আপলোড করা যাবে।");
  }
  if (file.size > MAX_BYTES) {
    throw new Error("ছবির সাইজ ৮ MB এর বেশি হতে পারবে না।");
  }

  const sb = supabaseAdmin();
  const ext = (file.name.split(".").pop() || "png").toLowerCase().replace(/[^a-z0-9]/g, "");
  const base = slugify(file.name.replace(/\.[^.]+$/, "")).slice(0, 40) || "image";
  const path = `${folder}/${Date.now()}-${base}.${ext}`;

  const { error } = await sb.storage
    .from(BUCKET)
    .upload(path, file, { contentType: file.type, upsert: true });
  if (error) throw error;

  return sb.storage.from(BUCKET).getPublicUrl(path).data.publicUrl;
}
