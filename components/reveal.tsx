'use client';
import { useEffect, type RefObject } from 'react';
// Reveals [data-reveal] children as they scroll into view. Content stays
// visible without JS, and everything appears at once with reduced motion.
export function useReveal(ref: RefObject<HTMLElement | null>, key: string) {
  useEffect(() => {
    const root = ref.current;
    if (!root) return;
    const items = Array.from(
      root.querySelectorAll<HTMLElement>('[data-reveal]:not(.in)'),
    );
    if (
      window.matchMedia('(prefers-reduced-motion: reduce)').matches ||
      !('IntersectionObserver' in window)
    ) {
      items.forEach((item) => item.classList.add('in'));
      return;
    }
    root.classList.add('reveal-ready');
    const observer = new IntersectionObserver(
      (entries) =>
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add('in');
          observer.unobserve(entry.target);
        }),
      { rootMargin: '0px 0px -8% 0px' },
    );
    items.forEach((item) => observer.observe(item));
    return () => observer.disconnect();
  }, [ref, key]);
}
