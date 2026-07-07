'use client';

import * as React from 'react';
import { useTheme } from 'next-themes';

/**
 * Wraps next-themes' setTheme with a circular "reveal" animation via the View Transitions API,
 * expanding outward from the click point. Falls back to an instant theme swap in browsers
 * without support (Firefox, older Safari) — there's nothing to polyfill here, a plain toggle
 * is a perfectly fine fallback.
 */
export function useThemeTransition() {
  const { theme, resolvedTheme, setTheme } = useTheme();

  const setThemeWithTransition = React.useCallback(
    (next: string, origin?: { x: number; y: number }) => {
      if (typeof document.startViewTransition !== 'function') {
        setTheme(next);
        return;
      }

      const x = origin?.x ?? window.innerWidth / 2;
      const y = origin?.y ?? window.innerHeight / 2;
      const radius = Math.hypot(
        Math.max(x, window.innerWidth - x),
        Math.max(y, window.innerHeight - y),
      );

      const root = document.documentElement;
      root.style.setProperty('--theme-transition-x', `${x}px`);
      root.style.setProperty('--theme-transition-y', `${y}px`);
      root.style.setProperty('--theme-transition-r', `${radius}px`);

      document.startViewTransition(() => {
        setTheme(next);
      });
    },
    [setTheme],
  );

  /** Convenience helper for a click-driven toggle button. */
  const toggleTheme = React.useCallback(
    (e: React.MouseEvent) => {
      setThemeWithTransition(resolvedTheme === 'dark' ? 'light' : 'dark', { x: e.clientX, y: e.clientY });
    },
    [resolvedTheme, setThemeWithTransition],
  );

  return { theme, resolvedTheme, setThemeWithTransition, toggleTheme };
}
