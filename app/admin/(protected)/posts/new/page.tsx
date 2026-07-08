import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { PostForm } from "@/components/admin/post-form";

export const dynamic = "force-dynamic";

export default function NewPostPage() {
  return (
    <div className="mx-auto max-w-3xl">
      <Link href="/admin/posts" className="inline-flex items-center gap-1 text-sm text-muted hover:text-accent">
        <ChevronLeft className="h-4 w-4" /> Blog Posts
      </Link>
      <h1 className="mt-2 font-serif text-2xl font-semibold text-ink">New post</h1>
      <p className="mb-6 mt-1 text-sm text-muted">Write in Markdown. Publish when ready.</p>
      <PostForm post={null} />
    </div>
  );
}
