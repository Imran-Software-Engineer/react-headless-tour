import { useId } from "react";
import { EASE_SPRING, useIsScrolling, useReducedMotion } from "./motion";
import type { TargetRect, TourStep } from "./types";

interface TourOverlayProps {
  rect: TargetRect | null;
  step: TourStep;
  /** False while the tour is fading out — blockers must stop eating clicks. */
  interactive: boolean;
  padding: number;
  radius: number;
  color?: string;
  blur: number;
  className?: string;
  onMaskClick?: () => void;
}

/**
 * Dimming overlay with an animated spotlight "hole" cut out via an SVG mask.
 * The hole glides smoothly between targets as steps change (CSS transitions
 * on the SVG geometry properties — no animation library needed).
 */
export function TourOverlay({
  rect,
  step,
  interactive,
  padding,
  radius,
  color,
  blur,
  className,
  onMaskClick,
}: TourOverlayProps) {
  const maskId = useId();
  const reducedMotion = useReducedMotion();
  const scrolling = useIsScrolling();

  const hole = rect
    ? {
        x: rect.x - padding,
        y: rect.y - padding,
        width: rect.width + padding * 2,
        height: rect.height + padding * 2,
      }
    : null;

  const fill = color ?? "var(--tour-overlay-color, rgba(0, 0, 0, 0.55))";
  const interactable = Boolean(step.interactable && hole);

  // While the page scrolls (auto scroll-into-view or the user's own), the
  // hole must stick to the target exactly — transitioning toward a moving
  // destination reads as lag. The glide only plays for stationary changes.
  const holeTransition =
    reducedMotion || scrolling
      ? undefined
      : ["x", "y", "width", "height", "rx"].map((p) => `${p} 350ms ${EASE_SPRING}`).join(", ");

  const blockerStyle: React.CSSProperties = {
    position: "absolute",
    pointerEvents: interactive ? "auto" : "none",
    cursor: onMaskClick ? "pointer" : "default",
  };

  return (
    <div
      data-tour-overlay=""
      className={className}
      style={{ position: "absolute", inset: 0, pointerEvents: "none" }}
    >
      <svg
        width="100%"
        height="100%"
        style={{
          position: "absolute",
          inset: 0,
          backdropFilter: blur ? `blur(${blur}px)` : undefined,
          WebkitBackdropFilter: blur ? `blur(${blur}px)` : undefined,
        }}
        aria-hidden="true"
      >
        <defs>
          <mask id={maskId}>
            <rect x="0" y="0" width="100%" height="100%" fill="#fff" />
            {hole && (
              <rect
                x={hole.x}
                y={hole.y}
                width={hole.width}
                height={hole.height}
                rx={radius}
                fill="#000"
                style={{ transition: holeTransition }}
              />
            )}
          </mask>
        </defs>
        <rect x="0" y="0" width="100%" height="100%" fill={fill} mask={`url(#${maskId})`} />
      </svg>

      {/* Click interception. When the step is interactable we block only the
          dimmed region (four rects around the hole), leaving the target live. */}
      {interactable && hole ? (
        <>
          <div style={{ ...blockerStyle, left: 0, top: 0, right: 0, height: Math.max(0, hole.y) }} onClick={onMaskClick} />
          <div style={{ ...blockerStyle, left: 0, top: hole.y + hole.height, right: 0, bottom: 0 }} onClick={onMaskClick} />
          <div style={{ ...blockerStyle, left: 0, top: hole.y, width: Math.max(0, hole.x), height: hole.height }} onClick={onMaskClick} />
          <div style={{ ...blockerStyle, left: hole.x + hole.width, top: hole.y, right: 0, height: hole.height }} onClick={onMaskClick} />
        </>
      ) : (
        <div style={{ ...blockerStyle, inset: 0 }} onClick={onMaskClick} />
      )}
    </div>
  );
}
