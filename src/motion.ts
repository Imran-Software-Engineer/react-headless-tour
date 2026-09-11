import { useEffect, useState } from "react";

/** Spring-like easing for movement (slight decelerating overshoot). */
export const EASE_SPRING = "cubic-bezier(0.22, 1, 0.36, 1)";

/**
 * False on first paint, true one frame later — lets CSS transitions animate
 * an element from its "initial" styles to its "entered" styles on mount.
 */
export function useEntered(): boolean {
  const [entered, setEntered] = useState(false);
  useEffect(() => {
    let inner = 0;
    const outer = requestAnimationFrame(() => {
      inner = requestAnimationFrame(() => setEntered(true));
    });
    return () => {
      cancelAnimationFrame(outer);
      cancelAnimationFrame(inner);
    };
  }, []);
  return entered;
}

/**
 * True while any scrolling is happening (window or nested containers),
 * falling back to false after `idleMs` without a scroll event. Used to make
 * the spotlight track its target 1:1 during scrolls instead of transitioning
 * toward a moving destination.
 */
export function useIsScrolling(idleMs = 150): boolean {
  const [scrolling, setScrolling] = useState(false);
  useEffect(() => {
    let timer: ReturnType<typeof setTimeout> | null = null;
    const onScroll = () => {
      setScrolling(true);
      if (timer) clearTimeout(timer);
      timer = setTimeout(() => setScrolling(false), idleMs);
    };
    window.addEventListener("scroll", onScroll, { capture: true, passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll, { capture: true });
      if (timer) clearTimeout(timer);
    };
  }, [idleMs]);
  return scrolling;
}

/** Tracks the user's prefers-reduced-motion setting (SSR-safe, live-updating). */
export function useReducedMotion(): boolean {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduced(mq.matches);
    const onChange = (e: MediaQueryListEvent) => setReduced(e.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);
  return reduced;
}
