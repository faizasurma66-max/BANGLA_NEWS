import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Image from "next/image";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { getPublishedPosts, getPost } from "@/lib/queries";
import { PageHero } from "@/components/site/page-hero";
import { ReadingProgress } from "@/components/site/reading-progress";
import { formatDate } from "@/lib/utils";

export const revalidate = 300;

type Params = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  const posts = await getPublishedPosts();
  return posts.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPost(slug);
  if (!post) return { title: "Post" };
  return {
    title: post.title,
    description: post.excerpt ?? undefined,
    openGraph: post.cover_image ? { images: [post.cover_image] } : undefined,
  };
}

export default async function PostPage({ params }: Params) {
  const { slug } = await params;
  const post = await getPost(slug);
  if (!post) notFound();

  return (
    <article>
      <ReadingProgress />
      <PageHero
        breadcrumb={[
          { label: "Home", href: "/" },
          { label: "Blog", href: "/blog" },
          { label: post.title },
        ]}
        kicker={formatDate(post.published_at ?? post.created_at)}
        title={post.title}
        description={post.excerpt}
      />

      <div className="mx-auto max-w-2xl px-4 py-10 sm:px-6 lg:px-8">
        {post.cover_image && (
          <div className="relative mb-8 aspect-[16/9] w-full overflow-hidden rounded-2xl border border-line bg-band">
            <Image
              src={post.cover_image}
              alt={post.title}
              fill
              sizes="(max-width: 768px) 100vw, 672px"
              className="object-cover"
              priority
            />
          </div>
        )}

        <div
          className="prose prose-neutral max-w-none
            prose-headings:font-serif prose-headings:tracking-tight prose-headings:text-ink
            prose-h1:text-3xl prose-h2:mt-10 prose-h2:mb-3 prose-h2:text-2xl
            prose-h3:mt-8 prose-h3:mb-2 prose-h3:text-xl
            prose-p:text-[17px] prose-p:leading-8 prose-p:text-ink-soft
            prose-a:font-medium prose-a:text-accent prose-a:no-underline hover:prose-a:underline
            prose-strong:text-ink
            prose-blockquote:rounded-r-xl prose-blockquote:border-l-[3px] prose-blockquote:border-accent prose-blockquote:bg-band prose-blockquote:px-5 prose-blockquote:py-1 prose-blockquote:font-normal prose-blockquote:not-italic prose-blockquote:text-ink
            prose-img:rounded-xl prose-img:border prose-img:border-line
            prose-hr:border-line
            prose-code:rounded prose-code:bg-band prose-code:px-1.5 prose-code:py-0.5 prose-code:text-[13px] prose-code:font-normal prose-code:before:content-[''] prose-code:after:content-['']
            prose-pre:rounded-xl prose-pre:border prose-pre:border-line
            prose-li:marker:text-accent prose-li:text-ink-soft"
        >
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            components={{
              table: (props) => (
                <div className="my-6 overflow-x-auto rounded-xl border border-line">
                  <table className="!my-0 w-full text-sm">{props.children}</table>
                </div>
              ),
            }}
          >
            {post.content}
          </ReactMarkdown>
        </div>
      </div>
    </article>
  );
}
