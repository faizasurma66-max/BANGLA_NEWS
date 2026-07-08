import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronLeft } from "lucide-react";
import { adminGetPost } from "@/lib/admin-queries";
import { PostForm } from "@/components/admin/post-form";

export const dynamic = "force-dynamic";

export default async function EditPostPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const post = await adminGetPost(id);
  if (!post) notFound();

  return (
    <div className="mx-auto max-w-3xl">
      <Link href="/admin/posts" className="inline-flex items-center gap-1 text-sm text-muted hover:text-accent">
        <ChevronLeft className="h-4 w-4" /> Blog Posts
      </Link>
      <h1 className="mt-2 font-serif text-2xl font-semibold text-ink">Edit post</h1>
      <p className="mb-6 mt-1 text-sm text-muted">{post.title}</p>
      <PostForm post={post} />
    </div>
  );
}
