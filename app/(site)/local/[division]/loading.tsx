import { PageHeroSkeleton, SkeletonGrid } from "@/components/site/skeleton";

export default function Loading() {
  return (
    <>
      <PageHeroSkeleton />
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <SkeletonGrid count={10} />
      </div>
    </>
  );
}
