"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Monte les enfants SEULEMENT quand visibles, et les DÉMONTE en sortant.
 * Libère le GPU pour la vidéo de fond.
 */
export default function LazyMount({
  children,
  className = "",
  minHeight = 360,
  rootMargin = "40px",
}: {
  children: React.ReactNode;
  className?: string;
  minHeight?: number;
  rootMargin?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [show, setShow] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        setShow(entry.isIntersecting);
      },
      { rootMargin, threshold: 0.05 }
    );
    io.observe(node);
    return () => io.disconnect();
  }, [rootMargin]);

  return (
    <div ref={ref} className={className} style={{ minHeight }}>
      {show ? (
        children
      ) : (
        <div
          className="flex items-center justify-center bg-black/30 text-[10px] tracking-[0.3em] uppercase text-white/25"
          style={{ minHeight }}
        >
          ·
        </div>
      )}
    </div>
  );
}
