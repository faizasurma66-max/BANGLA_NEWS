/** Reusable shimmer skeleton components that match real card dimensions. */

export function SkeletonCard() {
  return (
    <div className="flex flex-col border-b border-r border-line bg-surface">
      <div className="skeleton aspect-[16/10] w-full" />
      <div className="border-t border-line px-2.5 py-2.5 text-center">
        <div className="skeleton mx-auto h-3.5 w-3/4 rounded" />
        <div className="skeleton mx-auto mt-1.5 h-3 w-1/2 rounded" />
      </div>
    </div>
  );
}

export function SkeletonGrid({ count = 12 }: { count?: number }) {
  return (
    <div className="grid grid-cols-2 overflow-hidden rounded-xl border-l border-t border-line bg-surface sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
      {Array.from({ length: count }, (_, i) => (
        <SkeletonCard key={i} />
      ))}
    </div>
  );
}

export function SkeletonBlogCard() {
  return (
    <div className="overflow-hidden rounded-2xl border border-line bg-surface">
      <div className="skeleton aspect-[16/9] w-full" />
      <div className="p-5">
        <div className="skeleton h-3 w-20 rounded" />
        <div className="skeleton mt-3 h-5 w-4/5 rounded" />
        <div className="skeleton mt-2 h-4 w-full rounded" />
        <div className="skeleton mt-1 h-4 w-2/3 rounded" />
      </div>
    </div>
  );
}

export function SkeletonSectionHeader() {
  return (
    <div>
      <div className="skeleton h-3 w-16 rounded" />
      <div className="skeleton mt-2 h-7 w-48 rounded" />
      <div className="skeleton mt-2 h-4 w-72 rounded" />
    </div>
  );
}

export function SkeletonBlogGrid({ count = 6 }: { count?: number }) {
  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: count }, (_, i) => (
        <SkeletonBlogCard key={i} />
      ))}
    </div>
  );
}

export function PageHeroSkeleton() {
  return (
    <section className="border-b border-line bg-grain">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-14 lg:px-8">
        <div className="skeleton h-3.5 w-40 rounded" />
        <div className="skeleton mt-4 h-9 w-2/3 max-w-lg rounded" />
        <div className="skeleton mt-3 h-4 w-full max-w-2xl rounded" />
      </div>
    </section>
  );
}

export function ViewSkeleton() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="skeleton h-4 w-28 rounded" />
      <div className="mt-4 flex items-center gap-4 rounded-2xl border border-line bg-surface p-5 sm:p-6">
        <div className="skeleton h-16 w-16 rounded-2xl" />
        <div className="flex-1 space-y-2.5">
          <div className="skeleton h-5 w-56 rounded" />
          <div className="skeleton h-3.5 w-36 rounded" />
        </div>
      </div>
      <div className="skeleton mt-6 h-[72vh] w-full rounded-2xl" />
    </div>
  );
}
