import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
  type ReactNode,
} from "react";
import { createPortal } from "react-dom";
import { useEntered, useReducedMotion } from "./motion";
import type { TourControls, TourProviderProps, TourStep, TourStopReason } from "./types";
import { resolveTarget, useTargetRect } from "./useTargetRect";
import { TourOverlay } from "./TourOverlay";
import { TourPopover } from "./TourPopover";

const TourContext = createContext<TourControls | null>(null);

/** How long the closing fade runs before the tour UI unmounts, in ms. */
const EXIT_DURATION_MS = 220;

/** Read tour state and control the tour from anywhere under <TourProvider>. */
export function useTour(): TourControls {
  const ctx = useContext(TourContext);
  if (!ctx) throw new Error("useTour must be used within a <TourProvider>");
  return ctx;
}

type Phase = "idle" | "active" | "closing";

/** Fixed full-viewport layer that fades the tour UI in and out. */
function TourLayer({
  closing,
  zIndex,
  className,
  theme,
  children,
}: {
  closing: boolean;
  zIndex: number;
  className?: string;
  theme?: CSSProperties;
  children: ReactNode;
}) {
  const entered = useEntered();
  const reducedMotion = useReducedMotion();
  return (
    <div
      data-tour-root=""
      className={className}
      style={{
        position: "fixed",
        inset: 0,
        zIndex: `var(--tour-z-index, ${zIndex})` as unknown as number,
        pointerEvents: "none",
        opacity: entered && !closing ? 1 : 0,
        transition: reducedMotion ? undefined : `opacity ${EXIT_DURATION_MS}ms ease`,
        ...theme,
      }}
    >
      {children}
    </div>
  );
}

export function TourProvider(props: TourProviderProps) {
  const {
    children,
    steps,
    autoStart = false,
    stepIndex: controlledIndex,
    onStepChange,
    onStart,
    onStop,
    keyboard = true,
    lockScroll = false,
    scrollIntoViewOptions = { behavior: "smooth", block: "center", inline: "nearest" },
    portalContainer,
  } = props;

  const [mounted, setMounted] = useState(false);
  const [phase, setPhase] = useState<Phase>("idle");
  const [internalIndex, setInternalIndex] = useState(0);
  const isControlled = controlledIndex !== undefined;

  const isActive = phase === "active";
  const stepIndex = isActive ? (isControlled ? controlledIndex! : internalIndex) : -1;
  const step: TourStep | null =
    stepIndex >= 0 && stepIndex < steps.length ? steps[stepIndex] : null;

  // Snapshot of the last step so the closing fade can keep rendering it.
  const closingSnapshot = useRef<{ step: TourStep; stepIndex: number } | null>(null);
  const exitTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Keep latest values in refs so control callbacks stay referentially stable.
  const stateRef = useRef({ steps, stepIndex, step, phase, onStepChange, onStart, onStop });
  stateRef.current = { steps, stepIndex, step, phase, onStepChange, onStart, onStop };

  useEffect(() => setMounted(true), []);
  useEffect(
    () => () => {
      if (exitTimer.current) clearTimeout(exitTimer.current);
    },
    []
  );

  const setIndex = useCallback(
    (index: number) => {
      const s = stateRef.current;
      const clamped = Math.max(0, Math.min(index, s.steps.length - 1));
      if (clamped === s.stepIndex) return;
      s.step?.onExit?.(s.step, s.stepIndex);
      if (!isControlled) setInternalIndex(clamped);
      s.onStepChange?.(clamped, s.steps[clamped]);
    },
    [isControlled]
  );

  const start = useCallback(
    (atIndex = 0) => {
      const s = stateRef.current;
      if (s.phase === "active" || s.steps.length === 0) return;
      if (exitTimer.current) clearTimeout(exitTimer.current);
      const clamped = Math.max(0, Math.min(atIndex, s.steps.length - 1));
      if (!isControlled) setInternalIndex(clamped);
      else s.onStepChange?.(clamped, s.steps[clamped]);
      setPhase("active");
      s.onStart?.();
    },
    [isControlled]
  );

  const stop = useCallback((reason: TourStopReason = "programmatic") => {
    const s = stateRef.current;
    if (s.phase !== "active") return;
    s.step?.onExit?.(s.step, s.stepIndex);
    if (s.step) closingSnapshot.current = { step: s.step, stepIndex: s.stepIndex };
    setPhase("closing");
    if (exitTimer.current) clearTimeout(exitTimer.current);
    exitTimer.current = setTimeout(() => {
      closingSnapshot.current = null;
      setPhase("idle");
    }, EXIT_DURATION_MS);
    s.onStop?.(reason, s.stepIndex);
  }, []);

  const next = useCallback(() => {
    const s = stateRef.current;
    if (s.phase !== "active") return;
    if (s.stepIndex >= s.steps.length - 1) stop("finished");
    else setIndex(s.stepIndex + 1);
  }, [setIndex, stop]);

  const prev = useCallback(() => {
    const s = stateRef.current;
    if (s.phase !== "active" || s.stepIndex <= 0) return;
    setIndex(s.stepIndex - 1);
  }, [setIndex]);

  const goTo = useCallback((index: number) => setIndex(index), [setIndex]);

  // Auto-start once mounted.
  const autoStartedRef = useRef(false);
  useEffect(() => {
    if (autoStart && mounted && !autoStartedRef.current) {
      autoStartedRef.current = true;
      start(0);
    }
  }, [autoStart, mounted, start]);

  // Step lifecycle: onEnter + scroll into view.
  useEffect(() => {
    if (!isActive || !step) return;
    step.onEnter?.(step, stepIndex);
    if (!step.disableScroll) {
      const el = resolveTarget(step);
      const reducedMotion =
        typeof window !== "undefined" &&
        window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      el?.scrollIntoView(
        reducedMotion ? { ...scrollIntoViewOptions, behavior: "auto" } : scrollIntoViewOptions
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isActive, stepIndex]);

  // Keyboard navigation.
  useEffect(() => {
    if (!isActive || !keyboard) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") stop("escape");
      else if (e.key === "ArrowRight" || e.key === "Enter") next();
      else if (e.key === "ArrowLeft") prev();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [isActive, keyboard, next, prev, stop]);

  // Optional body scroll lock.
  useEffect(() => {
    if (!isActive || !lockScroll) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previous;
    };
  }, [isActive, lockScroll]);

  // While closing, keep rendering the last step so the fade-out has content.
  const renderStep = step ?? closingSnapshot.current?.step ?? null;
  const renderIndex = step ? stepIndex : closingSnapshot.current?.stepIndex ?? -1;
  const targetRect = useTargetRect(renderStep, phase !== "idle");

  const controls = useMemo<TourControls>(
    () => ({
      isActive,
      stepIndex,
      totalSteps: steps.length,
      step,
      isFirst: stepIndex <= 0,
      isLast: stepIndex === steps.length - 1,
      start,
      stop,
      next,
      prev,
      goTo,
    }),
    [isActive, stepIndex, steps.length, step, start, stop, next, prev, goTo]
  );

  const container =
    portalContainer ?? (typeof document !== "undefined" ? document.body : null);

  const zIndex = props.zIndex ?? 10000;
  const closing = phase === "closing";

  return (
    <TourContext.Provider value={controls}>
      {children}
      {mounted &&
        container &&
        phase !== "idle" &&
        renderStep &&
        createPortal(
          <TourLayer
            closing={closing}
            zIndex={zIndex}
            className={props.classNames?.root}
            theme={props.theme}
          >
            {(props.showOverlay ?? true) && (
              <TourOverlay
                rect={targetRect}
                step={renderStep}
                interactive={!closing}
                padding={renderStep.spotlightPadding ?? props.spotlightPadding ?? 8}
                radius={renderStep.spotlightRadius ?? props.spotlightRadius ?? 8}
                color={props.overlayColor}
                blur={props.overlayBlur ?? 0}
                className={props.classNames?.overlay}
                onMaskClick={props.closeOnMaskClick ? () => stop("mask") : undefined}
              />
            )}
            <TourPopover
              key={renderIndex}
              rect={targetRect}
              controls={controls}
              step={renderStep}
              interactive={!closing}
              offset={props.offset ?? 12}
              padding={renderStep.spotlightPadding ?? props.spotlightPadding ?? 8}
              components={props.components}
              classNames={props.classNames}
              labels={props.labels}
            />
          </TourLayer>,
          container
        )}
    </TourContext.Provider>
  );
}
