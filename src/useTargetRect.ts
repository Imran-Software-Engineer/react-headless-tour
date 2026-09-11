import { useEffect, useState } from "react";
import type { TargetRect, TourStep } from "./types";

export function resolveTarget(step: TourStep | null): Element | null {
  if (!step?.target) return null;
  if (typeof step.target === "function") return step.target();
  if (typeof document === "undefined") return null;
  return document.querySelector(step.target);
}

function readRect(el: Element): TargetRect {
  const r = el.getBoundingClientRect();
  return { x: r.left, y: r.top, width: r.width, height: r.height };
}

function rectsEqual(a: TargetRect | null, b: TargetRect | null) {
  if (a === b) return true;
  if (!a || !b) return false;
  return a.x === b.x && a.y === b.y && a.width === b.width && a.height === b.height;
}

/**
 * Tracks the viewport-relative rect of the active step's target, staying in
 * sync through scrolling, window resizes, element resizes and layout shifts.
 */
export function useTargetRect(step: TourStep | null, active: boolean): TargetRect | null {
  const [rect, setRect] = useState<TargetRect | null>(null);

  useEffect(() => {
    if (!active || !step) {
      setRect(null);
      return;
    }

    let el = resolveTarget(step);
    let frame = 0;
    let current: TargetRect | null = null;

    const update = () => {
      // Re-resolve in case the element mounted late (e.g. after a route change).
      if (!el || !el.isConnected) el = resolveTarget(step);
      const next = el ? readRect(el) : null;
      if (!rectsEqual(current, next)) {
        current = next;
        setRect(next);
      }
    };

    // A light rAF loop is the only approach that survives every way an element
    // can move (animations, sticky headers, virtualized lists, font loading).
    const tick = () => {
      update();
      frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    update();

    return () => cancelAnimationFrame(frame);
  }, [step, active]);

  return rect;
}
