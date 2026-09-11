import type { CSSProperties } from "react";
import type { TourCardProps, TourClassNames, TourProviderProps } from "./types";

/**
 * The zero-config default card. Every visual decision is a CSS variable with a
 * neutral fallback, so it can be re-themed without touching a line of code:
 *
 *   --tour-bg, --tour-fg, --tour-muted, --tour-accent, --tour-accent-fg,
 *   --tour-radius, --tour-shadow, --tour-border, --tour-font,
 *   --tour-max-width, --tour-padding, --tour-arrow-size
 *
 * For full control, replace it entirely via <TourProvider components={{ Card }}>.
 */
export function DefaultCard(
  props: TourCardProps & {
    labels?: TourProviderProps["labels"];
    classNames?: TourClassNames;
  }
) {
  const { step, stepIndex, totalSteps, isFirst, isLast, next, prev, stop, arrow, labels, classNames } = props;

  const buttonBase: CSSProperties = {
    font: "inherit",
    fontSize: "0.875em",
    fontWeight: 500,
    border: "var(--tour-border, 1px solid rgba(0,0,0,0.12))",
    borderRadius: "calc(var(--tour-radius, 12px) * 0.6)",
    padding: "0.45em 0.9em",
    cursor: "pointer",
    background: "transparent",
    color: "inherit",
  };

  return (
    <div
      data-tour-card=""
      className={classNames?.card}
      style={{
        position: "relative",
        background: "var(--tour-bg, #ffffff)",
        color: "var(--tour-fg, #1a1a1a)",
        fontFamily: "var(--tour-font, inherit)",
        borderRadius: "var(--tour-radius, 12px)",
        boxShadow: "var(--tour-shadow, 0 10px 38px -10px rgba(0,0,0,0.35), 0 10px 20px -15px rgba(0,0,0,0.2))",
        padding: "var(--tour-padding, 16px)",
        width: "max-content",
        maxWidth: "min(var(--tour-max-width, 320px), 100%)",
        boxSizing: "border-box",
      }}
    >
      {arrow}
      {step.title != null && (
        <div
          data-tour-title=""
          className={classNames?.title}
          style={{ fontWeight: 600, fontSize: "1em", marginBottom: 6 }}
        >
          {step.title}
        </div>
      )}
      {step.content != null && (
        <div
          data-tour-content=""
          className={classNames?.content}
          style={{ fontSize: "0.9em", lineHeight: 1.5, color: "var(--tour-muted, #555)" }}
        >
          {step.content}
        </div>
      )}
      <div
        data-tour-footer=""
        className={classNames?.footer}
        style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 14 }}
      >
        <span
          data-tour-progress=""
          className={classNames?.progress}
          style={{ fontSize: "0.8em", color: "var(--tour-muted, #888)", marginRight: "auto" }}
        >
          {labels?.progress ? labels.progress(stepIndex, totalSteps) : `${stepIndex + 1} / ${totalSteps}`}
        </span>
        <button
          type="button"
          data-tour-skip=""
          className={classNames?.skipButton}
          onClick={() => stop("skipped")}
          style={{ ...buttonBase, border: "none", color: "var(--tour-muted, #888)" }}
        >
          {labels?.skip ?? "Skip"}
        </button>
        {!isFirst && (
          <button
            type="button"
            data-tour-prev=""
            className={classNames?.navButton}
            onClick={prev}
            style={buttonBase}
          >
            {labels?.prev ?? "Back"}
          </button>
        )}
        <button
          type="button"
          data-tour-next=""
          className={classNames?.primaryButton}
          onClick={next}
          style={{
            ...buttonBase,
            border: "none",
            background: "var(--tour-accent, #1a1a1a)",
            color: "var(--tour-accent-fg, #ffffff)",
          }}
        >
          {isLast ? labels?.finish ?? "Finish" : labels?.next ?? "Next"}
        </button>
      </div>
    </div>
  );
}
