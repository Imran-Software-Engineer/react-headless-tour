import { useEffect, useMemo, useRef, useState } from "react";
import {
  arrow,
  autoUpdate,
  flip,
  offset,
  shift,
  size,
  useFloating,
} from "@floating-ui/react-dom";
import { EASE_SPRING, useEntered, useReducedMotion } from "./motion";
import type {
  TargetRect,
  TourCardProps,
  TourClassNames,
  TourComponents,
  TourControls,
  TourProviderProps,
  TourStep,
} from "./types";
import { DefaultCard } from "./DefaultCard";

interface TourPopoverProps {
  rect: TargetRect | null;
  step: TourStep;
  controls: TourControls;
  /** False while the tour is fading out. */
  interactive: boolean;
  offset: number;
  padding: number;
  components?: TourComponents;
  classNames?: TourClassNames;
  labels?: TourProviderProps["labels"];
}

export function TourPopover({
  rect,
  step,
  controls,
  interactive,
  offset: offsetDistance,
  padding,
  components,
  classNames,
  labels,
}: TourPopoverProps) {
  const arrowRef = useRef<HTMLDivElement | null>(null);
  const popoverRef = useRef<HTMLDivElement | null>(null);
  const hasTarget = Boolean(rect);
  // Enter animation: this component remounts per step (keyed by index), so
  // `entered` flips false → true on every step change.
  const entered = useEntered();
  const reducedMotion = useReducedMotion();

  // Move focus into the popover on each step so screen readers announce it
  // and keyboard users can reach its controls immediately.
  useEffect(() => {
    if (interactive) popoverRef.current?.focus({ preventScroll: true });
  }, [interactive]);
  // Space actually available for the popover, kept in sync by the size()
  // middleware so large targets / small viewports can't push the card
  // off-screen.
  const [maxSize, setMaxSize] = useState<{ width: number; height: number } | null>(null);
  const maxSizeRef = useRef(maxSize);
  maxSizeRef.current = maxSize;

  const { refs, floatingStyles, middlewareData, placement, update, isPositioned } = useFloating({
    placement: step.placement ?? "bottom",
    strategy: "fixed",
    whileElementsMounted: autoUpdate,
    middleware: [
      offset(offsetDistance + padding),
      // If neither side of the preferred axis fits (e.g. a full-width target
      // with placement "right"), try the other axis too.
      flip({ padding: 12, fallbackAxisSideDirection: "start" }),
      // crossAxis lets shift pull the popover back into view even when that
      // means overlapping a large target.
      shift({ padding: 12, crossAxis: true }),
      size({
        padding: 12,
        apply({ availableWidth, availableHeight }) {
          const next = {
            width: Math.max(120, Math.floor(availableWidth)),
            height: Math.max(80, Math.floor(availableHeight)),
          };
          const current = maxSizeRef.current;
          if (!current || Math.abs(current.width - next.width) > 1 || Math.abs(current.height - next.height) > 1) {
            setMaxSize(next);
          }
        },
      }),
      arrow({ element: arrowRef, padding: 12 }),
    ],
  });

  // Anchor floating-ui to the tracked rect via a virtual element.
  useEffect(() => {
    if (!rect) return;
    refs.setReference({
      getBoundingClientRect: () => ({
        x: rect.x,
        y: rect.y,
        width: rect.width,
        height: rect.height,
        top: rect.y,
        left: rect.x,
        right: rect.x + rect.width,
        bottom: rect.y + rect.height,
      }),
    });
    update();
  }, [rect, refs, update]);

  const side = placement.split("-")[0] as "top" | "bottom" | "left" | "right";

  const arrowNode = useMemo(() => {
    if (!hasTarget) return null;
    const { x, y } = middlewareData.arrow ?? {};
    const staticSide = { top: "bottom", bottom: "top", left: "right", right: "left" }[side];
    const ArrowComponent = components?.Arrow;
    return (
      <div
        ref={arrowRef}
        data-tour-arrow=""
        className={classNames?.arrow}
        style={{
          position: "absolute",
          left: x != null ? x : undefined,
          top: y != null ? y : undefined,
          [staticSide]: "calc(var(--tour-arrow-size, 12px) / -2)",
          pointerEvents: "none",
        }}
      >
        {ArrowComponent ? (
          <ArrowComponent side={side} />
        ) : (
          <div
            style={{
              width: "var(--tour-arrow-size, 12px)",
              height: "var(--tour-arrow-size, 12px)",
              transform: "rotate(45deg)",
              background: "var(--tour-bg, #ffffff)",
              borderRadius: 2,
            }}
          />
        )}
      </div>
    );
  }, [hasTarget, middlewareData.arrow, side, components?.Arrow, classNames?.arrow]);

  const CustomCard = components?.Card;
  const cardProps: TourCardProps = { ...controls, step, arrow: arrowNode };

  const positionStyles: React.CSSProperties = hasTarget
    ? floatingStyles
    : {
        position: "fixed",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
      };

  return (
    <div
      ref={(node) => {
        refs.setFloating(node);
        popoverRef.current = node;
      }}
      tabIndex={-1}
      data-tour-popover=""
      className={classNames?.popover}
      style={{
        ...positionStyles,
        // Never paint before Floating UI has computed a real position — a
        // freshly mounted popover would otherwise flash at a stale spot.
        visibility: hasTarget && !isPositioned ? "hidden" : undefined,
        pointerEvents: interactive ? "auto" : "none",
        maxWidth: hasTarget && maxSize ? Math.min(maxSize.width, window.innerWidth - 24) : "calc(100vw - 24px)",
        maxHeight: hasTarget && maxSize ? maxSize.height : "calc(100vh - 24px)",
        overflowY: "auto",
      }}
      role="dialog"
      aria-modal="false"
      aria-label={`Tour step ${controls.stepIndex + 1} of ${controls.totalSteps}${
        typeof step.title === "string" ? `: ${step.title}` : ""
      }`}
    >
      <div
        style={{
          opacity: entered ? 1 : 0,
          transform: entered
            ? "none"
            : `scale(0.96) translateY(${side === "top" ? 6 : -6}px)`,
          transition: reducedMotion
            ? undefined
            : `opacity 200ms ease, transform 250ms ${EASE_SPRING}`,
        }}
      >
        {CustomCard ? (
          <CustomCard {...cardProps} />
        ) : (
          <DefaultCard {...cardProps} labels={labels} classNames={classNames} />
        )}
      </div>
    </div>
  );
}
