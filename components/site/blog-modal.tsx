"use client";

import { useEffect, useCallback, useRef } from "react";
import Image from "next/image";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { X } from "lucide-react";
import { formatDate } from "@/lib/utils";
import type { Post } from "@/lib/types";

/**
 * Extract image URLs from markdown content.
 * Matches both ![alt](url) and bare image URLs.
 */
function extractImages(markdown: string): string[] {
  const regex = /!\[.*?\]\((https?:\/\/[^\s)]+)\)/g;
  const images: string[] = [];
  let match;
  while ((match = regex.exec(markdown)) !== null) {
    images.push(match[1]);
  }
  return images;
}

/**
 * Premium macOS-style modal for viewing blog posts.
 * Features blurred backdrop, traffic-light dots, photo carousel, and scrollable content.
 */
export function BlogModal({
  post,
  onClose,
}: {
  post: Post;
  onClose: () => void;
}) {
  const overlayRef = useRef<HTMLDivElement>(null);
  const images = extractImages(post.content);

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    },
    [onClose],
  );

  useEffect(() => {
    document.addEventListener("keydown", handleKeyDown);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [handleKeyDown]);

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === overlayRef.current) onClose();
  };

  return (
    <div
      ref={overlayRef}
      onClick={handleBackdropClick}
      className="modal-backdrop fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-8"
      role="dialog"
      aria-modal="true"
      aria-label={post.title}
    >
      <div className="mac-window modal-enter flex max-h-[90vh] w-full max-w-3xl flex-col overflow-hidden">
        {/* macOS Title bar */}
        <div className="mac-titlebar shrink-0">
          <div className="flex items-center gap-[7px]">
            <button
              onClick={onClose}
              className="mac-dot mac-dot-red"
              aria-label="Close"
            />
            <span className="mac-dot mac-dot-yellow" />
            <span className="mac-dot mac-dot-green" />
          </div>
          <div className="ml-3 flex-1 truncate">
            <span className="text-sm font-medium text-ink-soft">{post.title}</span>
          </div>
          <button
            onClick={onClose}
            className="grid h-7 w-7 place-items-center rounded-lg text-muted transition hover:bg-line hover:text-ink"
            aria-label="Close"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Scrollable content */}
        <div className="flex-1 overflow-y-auto overscroll-contain">
          {/* Cover image */}
          {post.cover_image && (
            <div className="relative aspect-[16/7] w-full overflow-hidden bg-band">
              <Image
                src={post.cover_image}
                alt={post.title}
                fill
                sizes="(max-width: 768px) 100vw, 768px"
                className="object-cover"
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/25 to-transparent" />
            </div>
          )}

          {/* Photo carousel (if markdown has multiple images) */}
          {images.length > 1 && (
            <div className="border-b border-line bg-band/50 px-6 py-4">
              <p className="mb-2 text-xs font-medium uppercase tracking-wide text-faint">
                Photos ({images.length})
              </p>
              <div className="blog-carousel">
                {images.map((src, i) => (
                  <div
                    key={i}
                    className="relative h-32 w-48 shrink-0 overflow-hidden rounded-xl border border-line bg-white sm:h-40 sm:w-56"
                  >
                    <Image
                      src={src}
                      alt={`Photo ${i + 1}`}
                      fill
                      sizes="224px"
                      className="object-cover"
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Article body */}
          <div className="px-6 py-6 sm:px-8 sm:py-8">
            <div className="mb-4 flex items-center gap-3">
              <time className="text-xs font-medium uppercase tracking-wide text-faint">
                {formatDate(post.published_at ?? post.created_at)}
              </time>
              {post.excerpt && (
                <>
                  <span className="text-line-strong">·</span>
                  <span className="text-xs text-muted">
                    {Math.ceil(post.content.split(/\s+/).length / 200)} min read
                  </span>
                </>
              )}
            </div>

            <h1 className="font-serif text-2xl font-semibold leading-tight tracking-tight text-ink sm:text-3xl">
              {post.title}
            </h1>

            {post.excerpt && (
              <p className="mt-3 text-base leading-relaxed text-muted">
                {post.excerpt}
              </p>
            )}

            <hr className="my-6 border-line" />

            <div className="prose prose-neutral max-w-none prose-headings:font-serif prose-headings:tracking-tight prose-a:text-accent prose-a:no-underline hover:prose-a:underline prose-img:rounded-xl prose-img:border prose-img:border-line">
              <ReactMarkdown remarkPlugins={[remarkGfm]}>
                {post.content}
              </ReactMarkdown>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
