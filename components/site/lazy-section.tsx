"use client";

import { useRef, useState, useEffect, startTransition, type ReactNode } from "react";

/**
 * Renders a skeleton placeholder until the section scrolls into view,
 * then swaps to the real content with a smooth entrance animation.
 * Uses IntersectionObserver with generous rootMargin so content is
 * ready before the user scrolls to it.
 */
export function LazySection({
  children,
  skeleton,
  className,
}: {
  children: ReactNode;
  skeleton: ReactNode;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          startTransition(() => setVisible(true));
          observer.disconnect();
        }
      },
      { rootMargin: "200px 0px" },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={ref} className={className}>
      {visible ? (
        <div className="animate-fade-slide-up">{children}</div>
      ) : (
        skeleton
      )}
    </div>
  );
}
