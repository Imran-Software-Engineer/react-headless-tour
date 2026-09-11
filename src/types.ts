import type { CSSProperties, ReactNode } from "react";
import type { Placement } from "@floating-ui/react-dom";

export type { Placement };

/** A single step of the tour. */
export interface TourStep {
  /**
   * The element to highlight: a CSS selector or a function returning the
   * element. Omit it to show a centered, modal-style step (great for
   * welcome/outro screens).
   */
  target?: string | (() => Element | null);
  /** Rendered by the default Card. Custom Cards receive the whole step. */
  title?: ReactNode;
  /** Rendered by the default Card. Custom Cards receive the whole step. */
  content?: ReactNode;
  /** Preferred popover placement relative to the target. Default: "bottom". */
  placement?: Placement;
  /** Extra space around the target inside the spotlight, in px. */
  spotlightPadding?: number;
  /** Corner radius of the spotlight hole, in px. */
  spotlightRadius?: number;
  /** Let the user interact (click/type) with the highlighted element. */
  interactable?: boolean;
  /** Skip auto-scrolling the target into view for this step. */
  disableScroll?: boolean;
  /** Anything you want to pass through to a custom Card. */
  data?: unknown;
  /** Called when the step becomes active. */
  onEnter?: (step: TourStep, index: number) => void;
  /** Called when the step is left (next, prev, goTo or stop). */
  onExit?: (step: TourStep, index: number) => void;
}

export type TourStopReason = "finished" | "skipped" | "escape" | "mask" | "programmatic";

/** Everything a custom Card (or any consumer of useTour) can read and do. */
export interface TourControls {
  isActive: boolean;
  /** Index of the active step, or -1 when the tour is off. */
  stepIndex: number;
  totalSteps: number;
  /** The active step object, or null when the tour is off. */
  step: TourStep | null;
  isFirst: boolean;
  isLast: boolean;
  start: (atIndex?: number) => void;
  stop: (reason?: TourStopReason) => void;
  next: () => void;
  prev: () => void;
  goTo: (index: number) => void;
}

/** Props handed to a custom Card component. */
export interface TourCardProps extends TourControls {
  step: TourStep;
  /**
   * Pre-positioned arrow node. Render it anywhere inside your card (or don't,
   * for an arrowless design).
   */
  arrow: ReactNode;
}

/** Props handed to a custom Arrow component. */
export interface TourArrowProps {
  /** Which side of the target the popover ended up on. */
  side: "top" | "bottom" | "left" | "right";
}

export interface TourComponents {
  /** Replace the entire step card. You own 100% of the markup and styling. */
  Card?: React.ComponentType<TourCardProps>;
  /** Replace just the arrow of the default card. */
  Arrow?: React.ComponentType<TourArrowProps>;
}

export interface TourClassNames {
  /** The fixed, full-viewport root that hosts overlay + popover. */
  root?: string;
  /** The SVG dimming overlay. */
  overlay?: string;
  /** The floating popover wrapper (positioning only — style your Card instead). */
  popover?: string;
  /** Default card parts (ignored when you supply your own Card). */
  card?: string;
  title?: string;
  content?: string;
  footer?: string;
  progress?: string;
  navButton?: string;
  primaryButton?: string;
  skipButton?: string;
  arrow?: string;
}

export interface TourProviderProps {
  children: ReactNode;
  steps: TourStep[];

  /** Start the tour automatically on mount. Default: false. */
  autoStart?: boolean;
  /** Controlled step index. Pair with onStepChange. */
  stepIndex?: number;
  /** Fires whenever the active step changes (including via keyboard). */
  onStepChange?: (index: number, step: TourStep) => void;
  /** Fires when the tour starts. */
  onStart?: () => void;
  /** Fires when the tour stops, with the reason. */
  onStop?: (reason: TourStopReason, lastIndex: number) => void;

  /** Swap in your own components. This is the "bring your own theme" lever. */
  components?: TourComponents;
  /** Class hooks for every part — style with Tailwind, CSS modules, anything. */
  classNames?: TourClassNames;
  /**
   * Inline CSS-variable overrides (e.g. { "--tour-accent": "#7c3aed" }).
   * Applied to the tour root, so they win over global CSS.
   */
  theme?: CSSProperties & Record<`--${string}`, string | number>;

  /** Overlay color. Default: rgba(0,0,0,0.55). Also themeable via --tour-overlay-color. */
  overlayColor?: string;
  /** Overlay blur radius in px (frosted-glass effect). Default: 0. */
  overlayBlur?: number;
  /** Default spotlight padding for all steps. Default: 8. */
  spotlightPadding?: number;
  /** Default spotlight corner radius for all steps. Default: 8. */
  spotlightRadius?: number;
  /** Render the dimming overlay at all. Default: true. */
  showOverlay?: boolean;
  /** Clicking the dimmed area stops the tour. Default: false. */
  closeOnMaskClick?: boolean;
  /** Escape stops, arrow keys navigate. Default: true. */
  keyboard?: boolean;
  /** Distance between target and popover, in px. Default: 12. */
  offset?: number;
  /** Options for scrolling targets into view. */
  scrollIntoViewOptions?: ScrollIntoViewOptions;
  /** Lock body scroll while the tour is active. Default: false. */
  lockScroll?: boolean;
  /** Where to portal the tour UI. Default: document.body. */
  portalContainer?: Element | null;
  /** z-index of the tour root. Default: 10000. Also --tour-z-index. */
  zIndex?: number;

  /** Labels for the default card — plain strings or your own nodes/i18n. */
  labels?: {
    next?: ReactNode;
    prev?: ReactNode;
    finish?: ReactNode;
    skip?: ReactNode;
    /** Progress formatter. Default: (i, n) => `${i + 1} / ${n}` */
    progress?: (index: number, total: number) => ReactNode;
  };
}

/** Viewport-relative rect of the highlighted target. */
export interface TargetRect {
  x: number;
  y: number;
  width: number;
  height: number;
}
