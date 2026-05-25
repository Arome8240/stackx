'use client';

import * as React from 'react';

interface UseIntersectionOptions extends IntersectionObserverInit {
  once?: boolean;
}

export function useIntersection<T extends Element>(options: UseIntersectionOptions = {}) {
  const { once = false, ...observerOptions } = options;
  const ref = React.useRef<T>(null);
  const [isIntersecting, setIsIntersecting] = React.useState(false);

  React.useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(([entry]) => {
      setIsIntersecting(entry.isIntersecting);
      if (once && entry.isIntersecting) observer.disconnect();
    }, observerOptions);

    observer.observe(el);
    return () => observer.disconnect();
  }, [once, observerOptions.threshold, observerOptions.rootMargin]);

  return { ref, isIntersecting };
}
