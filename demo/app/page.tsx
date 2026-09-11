"use client";

import { useState } from "react";
import {
  TourProvider,
  useTour,
  type TourStep,
  type TourCardProps,
} from "react-headless-tour";

const GITHUB_URL = "https://github.com/Imran-Software-Engineer/react-headless-tour";

const steps: TourStep[] = [
  {
    title: "Welcome to react-headless-tour 👋",
    content:
      "This tour is running on the library itself. A step without a target renders as a centered modal — perfect for intros. Use ← → or Enter/Esc.",
  },
  {
    target: "#install",
    title: "Install it",
    content: "One tiny dependency (Floating UI). ~4.5 kB of library code, min+gzip — React 18 or 19.",
    placement: "bottom",
  },
  {
    target: "#playground",
    title: "A live playground",
    content:
      "The spotlight springs between targets and follows them through scrolling and resizes. This step is interactable — try clicking the button inside.",
    placement: "right",
    interactable: true,
  },
  {
    target: "#theme-picker",
    title: "Restyle everything",
    content:
      "Switch the flavor here, then restart the tour: same logic, completely different skin. CSS variables, class names, or your own components.",
    placement: "bottom",
  },
  {
    target: "#features",
    title: "Batteries included",
    content: "Positioning, keyboard nav, scroll tracking, interactable steps, SSR safety — all handled for you.",
    placement: "top",
  },
  {
    target: "#docs",
    title: "Read the docs",
    content: "Quick start and the full theming guide live right on this page. That's the tour — enjoy! ✨",
    placement: "top",
  },
];

/* A fully custom card — the library provides state + positioning, you own the pixels. */
function BrandCard({ step, stepIndex, totalSteps, isFirst, isLast, next, prev, stop, arrow }: TourCardProps) {
  return (
    <div
      style={{
        position: "relative",
        width: 300,
        borderRadius: 18,
        padding: 18,
        color: "#fff",
        background: "linear-gradient(135deg, #7c3aed 0%, #db2777 100%)",
        boxShadow: "0 18px 50px -12px rgba(124, 58, 237, 0.55)",
        ["--tour-bg" as string]: "#7c3aed",
      }}
    >
      {arrow}
      <div style={{ display: "flex", gap: 6, marginBottom: 12 }}>
        {Array.from({ length: totalSteps }).map((_, i) => (
          <span
            key={i}
            style={{
              height: 4,
              flex: 1,
              borderRadius: 2,
              background: i <= stepIndex ? "#fff" : "rgba(255,255,255,0.3)",
            }}
          />
        ))}
      </div>
      <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 6 }}>{step.title}</div>
      <div style={{ fontSize: 13, lineHeight: 1.5, opacity: 0.9 }}>{step.content}</div>
      <div style={{ display: "flex", gap: 8, marginTop: 16, alignItems: "center" }}>
        <button onClick={() => stop("skipped")} style={ghostBtn}>
          Skip
        </button>
        <span style={{ marginLeft: "auto" }} />
        {!isFirst && (
          <button onClick={prev} style={ghostBtn}>
            ←
          </button>
        )}
        <button onClick={next} style={solidBtn}>
          {isLast ? "Done ✨" : "Next →"}
        </button>
      </div>
    </div>
  );
}

const ghostBtn: React.CSSProperties = {
  background: "rgba(255,255,255,0.15)",
  border: "none",
  color: "#fff",
  borderRadius: 10,
  padding: "7px 12px",
  fontSize: 13,
  cursor: "pointer",
};

const solidBtn: React.CSSProperties = {
  background: "#fff",
  border: "none",
  color: "#7c3aed",
  borderRadius: 10,
  padding: "7px 14px",
  fontSize: 13,
  fontWeight: 700,
  cursor: "pointer",
};

type Flavor = "default" | "dark" | "brand";

const FEATURES: [string, string, string][] = [
  ["🎨", "Three levels of theming", "CSS variables → class names → replace whole components. Your design system wins."],
  ["✨", "Springy spotlight", "An SVG-mask cutout glides smoothly between targets — pure CSS, no animation library."],
  ["📐", "Bulletproof positioning", "Floating UI under the hood — auto flip, shift and arrow. No clipped tooltips."],
  ["⌨️", "Keyboard navigation", "Arrow keys, Enter and Escape work out of the box. Fully optional."],
  ["🖱️", "Interactable steps", "Let users click the highlighted element mid-tour — great for guided actions."],
  ["🧭", "Follows moving targets", "Survives scrolling, resizes, sticky headers and layout shifts via live tracking."],
  ["🌐", "Next.js ready", "SSR-safe, ships \"use client\" for the App Router. ESM + CJS + full types."],
  ["🪶", "Tiny", "~4.5 kB min+gzip of library code. One provider, one hook, one dependency."],
];

const QUICKSTART = `import { TourProvider, useTour, type TourStep } from "react-headless-tour";

const steps: TourStep[] = [
  { title: "Welcome 👋", content: "No target = centered modal step." },
  { target: "#stats", title: "Your metrics", content: "At a glance." },
  { target: "#new", title: "Create one", placement: "left", interactable: true },
];

function StartButton() {
  const { start } = useTour();
  return <button onClick={() => start()}>Start tour</button>;
}

export default function App() {
  return (
    <TourProvider steps={steps}>
      <StartButton />
      {/* ...your app... */}
    </TourProvider>
  );
}`;

const THEME_CSS = `.my-tour {
  --tour-bg: #16181d;          /* card background   */
  --tour-fg: #f9fafb;          /* card text         */
  --tour-accent: #4f46e5;      /* primary button    */
  --tour-radius: 14px;
  --tour-overlay-color: rgba(10, 12, 24, 0.68);
}`;

const CUSTOM_CARD = `import type { TourCardProps } from "react-headless-tour";

function MyCard({ step, next, prev, stop, isLast, arrow }: TourCardProps) {
  return (
    <div className="my-design-system-popover">
      {arrow /* optional — skip it for an arrowless design */}
      <h3>{step.title}</h3>
      <p>{step.content}</p>
      <button onClick={next}>{isLast ? "Done" : "Next"}</button>
    </div>
  );
}

<TourProvider steps={steps} components={{ Card: MyCard }} />`;

function CodeBlock({ code }: { code: string }) {
  return (
    <pre
      style={{
        background: "#16181d",
        color: "#e5e7eb",
        borderRadius: 14,
        padding: "18px 20px",
        fontSize: 13,
        lineHeight: 1.6,
        overflowX: "auto",
      }}
    >
      <code>{code}</code>
    </pre>
  );
}

function Landing({ flavor, setFlavor }: { flavor: Flavor; setFlavor: (f: Flavor) => void }) {
  const { start, isActive } = useTour();
  const [clicks, setClicks] = useState(0);
  const [copied, setCopied] = useState(false);

  const copyInstall = async () => {
    try {
      await navigator.clipboard.writeText("npm install react-headless-tour");
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      /* clipboard unavailable */
    }
  };

  return (
    <div>
      <a
        href="#main"
        style={{
          position: "absolute",
          left: -9999,
          top: 0,
          background: "var(--brand)",
          color: "#fff",
          padding: "10px 16px",
          borderRadius: 8,
          zIndex: 200,
        }}
        onFocus={(e) => (e.currentTarget.style.left = "12px")}
        onBlur={(e) => (e.currentTarget.style.left = "-9999px")}
      >
        Skip to content
      </a>
      {/* ---------- Header ---------- */}
      <header
        style={{
          position: "sticky",
          top: 0,
          zIndex: 100,
          display: "flex",
          alignItems: "center",
          gap: 20,
          padding: "14px 28px",
          background: "rgba(250,250,250,0.85)",
          backdropFilter: "blur(8px)",
          borderBottom: "1px solid var(--line)",
        }}
      >
        <span style={{ fontWeight: 800, fontSize: 15 }}>
          <span aria-hidden="true">⛺ </span>react-headless-tour
        </span>
        <nav
          aria-label="Main"
          style={{ marginLeft: "auto", display: "flex", gap: 18, alignItems: "center", fontSize: 14 }}
        >
          <a href="#features" style={navLink}>Features</a>
          <a href="#compare" style={navLink}>Compare</a>
          <a href="#docs" style={navLink}>Docs</a>
          <a href="#api" style={navLink}>API</a>
          <a
            href={GITHUB_URL}
            target="_blank"
            rel="noreferrer"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 7,
              background: "var(--ink)",
              color: "#fff",
              borderRadius: 8,
              padding: "8px 14px",
              fontSize: 13,
              fontWeight: 600,
              textDecoration: "none",
            }}
          >
            <svg width="15" height="15" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
              <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27s1.36.09 2 .27c1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.01 8.01 0 0 0 16 8c0-4.42-3.58-8-8-8Z" />
            </svg>
            GitHub
          </a>
        </nav>
      </header>

      {/* ---------- Hero ---------- */}
      <main id="main">
      <section aria-label="Introduction" style={{ maxWidth: 960, margin: "0 auto", padding: "72px 28px 40px", textAlign: "center" }}>
        <div
          style={{
            display: "inline-block",
            background: "var(--brand-soft)",
            color: "var(--brand)",
            borderRadius: 999,
            padding: "6px 14px",
            fontSize: 13,
            fontWeight: 600,
            marginBottom: 20,
          }}
        >
          ⚡ Just 4.5 kB — the lightest fully-featured React tour library
        </div>
        <h1 style={{ fontSize: "clamp(32px, 5vw, 54px)", lineHeight: 1.1, letterSpacing: "-0.02em" }}>
          Product tours that wear
          <br />
          <span style={{ color: "var(--brand)" }}>your design system</span>
        </h1>
        <p style={{ color: "var(--muted)", fontSize: 17, maxWidth: 560, margin: "18px auto 0", lineHeight: 1.6 }}>
          All the logic — targeting, positioning, animated spotlight, keyboard navigation — none of the opinions.
          Restyle it with CSS variables, class names, or replace every component with your own.
        </p>

        <div style={{ display: "flex", gap: 12, justifyContent: "center", marginTop: 30, flexWrap: "wrap" }}>
          <button
            onClick={() => start()}
            disabled={isActive}
            style={{
              background: "var(--brand)",
              color: "#fff",
              border: "none",
              borderRadius: 10,
              padding: "13px 26px",
              fontSize: 15,
              fontWeight: 700,
              cursor: "pointer",
              boxShadow: "0 8px 24px -8px rgba(79,70,229,0.6)",
            }}
          >
            ▶ Take the tour
          </button>
          <button
            id="install"
            onClick={copyInstall}
            title="Copy to clipboard"
            aria-label="Copy the npm install command to clipboard"
            style={{
              background: "var(--panel)",
              border: "1px solid var(--line)",
              borderRadius: 10,
              padding: "13px 20px",
              fontSize: 14,
              fontFamily: "ui-monospace, Menlo, monospace",
              cursor: "pointer",
              color: "var(--ink)",
            }}
          >
            {copied ? "✓ copied!" : "npm install react-headless-tour 📋"}
          </button>
        </div>

        <div
          style={{
            display: "flex",
            gap: 26,
            justifyContent: "center",
            marginTop: 34,
            flexWrap: "wrap",
            fontSize: 13,
            color: "var(--muted)",
          }}
        >
          {[
            ["4.5 kB", "core, min+gzip"],
            ["1", "dependency"],
            ["0", "animation libraries"],
            ["100%", "yours to style"],
          ].map(([n, label]) => (
            <span key={label} style={{ display: "flex", alignItems: "baseline", gap: 6 }}>
              <strong style={{ fontSize: 20, color: "var(--ink)" }}>{n}</strong> {label}
            </span>
          ))}
        </div>
      </section>

      {/* ---------- Playground ---------- */}
      <section style={{ maxWidth: 960, margin: "0 auto", padding: "20px 28px 40px" }}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 12,
            marginBottom: 14,
            flexWrap: "wrap",
          }}
        >
          <h2 style={{ fontSize: 20 }}>Live playground</h2>
          <span style={{ marginLeft: "auto", display: "flex", gap: 8, alignItems: "center" }}>
            <label htmlFor="theme-picker" style={{ fontSize: 13, color: "var(--muted)" }}>
              Tour flavor:
            </label>
            <select
              id="theme-picker"
              value={flavor}
              onChange={(e) => setFlavor(e.target.value as Flavor)}
              style={{
                padding: "9px 12px",
                borderRadius: 8,
                border: "1px solid var(--line)",
                fontSize: 13,
                background: "var(--panel)",
              }}
            >
              <option value="default">Default (zero config)</option>
              <option value="dark">Dark (CSS variables only)</option>
              <option value="brand">Brand (custom component)</option>
            </select>
          </span>
        </div>

        <div
          id="playground"
          style={{
            background: "var(--panel)",
            border: "1px solid var(--line)",
            borderRadius: 16,
            padding: 22,
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
            gap: 14,
          }}
        >
          {[
            ["Revenue", "$48,210", "+12.4%"],
            ["Active users", "8,431", "+3.1%"],
            ["Churn", "1.9%", "-0.4%"],
          ].map(([label, value, delta]) => (
            <div key={label} style={{ border: "1px solid var(--line)", borderRadius: 12, padding: 16 }}>
              <div style={{ fontSize: 12, color: "var(--muted)" }}>{label}</div>
              <div style={{ fontSize: 24, fontWeight: 700, margin: "6px 0" }}>{value}</div>
              <div style={{ fontSize: 12, color: delta.startsWith("-") ? "#dc2626" : "#15803d" }}>{delta}</div>
            </div>
          ))}
          <div
            style={{
              border: "1px solid var(--line)",
              borderRadius: 12,
              padding: 16,
              display: "flex",
              flexDirection: "column",
              gap: 10,
              justifyContent: "center",
            }}
          >
            <button
              onClick={() => setClicks((c) => c + 1)}
              style={{
                background: "var(--brand-soft)",
                color: "var(--brand)",
                border: "1px dashed var(--brand)",
                borderRadius: 10,
                padding: "12px",
                fontSize: 13,
                fontWeight: 600,
                cursor: "pointer",
              }}
            >
              + New project {clicks > 0 && `(clicked ${clicks}×)`}
            </button>
            <span style={{ fontSize: 12, color: "var(--muted)", textAlign: "center" }}>
              clickable during the tour
            </span>
          </div>
        </div>
      </section>

      {/* ---------- Features ---------- */}
      <section id="features" style={{ maxWidth: 960, margin: "0 auto", padding: "30px 28px 50px" }}>
        <h2 style={{ fontSize: 24, marginBottom: 20, textAlign: "center" }}>Why another tour library?</h2>
        <p style={{ color: "var(--muted)", textAlign: "center", maxWidth: 620, margin: "0 auto 32px", lineHeight: 1.6 }}>
          Most tour packages ship their own look and fight your theme. This one is headless: it does the hard parts and
          stays out of your stylesheet.
        </p>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(210px, 1fr))", gap: 14 }}>
          {FEATURES.map(([icon, title, body]) => (
            <div
              key={title}
              style={{ background: "var(--panel)", border: "1px solid var(--line)", borderRadius: 14, padding: 18 }}
            >
              <div aria-hidden="true" style={{ fontSize: 22 }}>{icon}</div>
              <h3 style={{ fontWeight: 700, fontSize: 14, margin: "10px 0 6px" }}>{title}</h3>
              <p style={{ fontSize: 13, color: "var(--muted)", lineHeight: 1.55 }}>{body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ---------- Comparison ---------- */}
      <section id="compare" style={{ maxWidth: 800, margin: "0 auto", padding: "10px 28px 40px" }}>
        <h2 style={{ fontSize: 24, marginBottom: 6, textAlign: "center" }}>Size matters</h2>
        <p style={{ color: "var(--muted)", textAlign: "center", marginBottom: 20, lineHeight: 1.6 }}>
          Every kilobyte you ship is loading time your users pay for a feature they see once.
        </p>
        <ApiTable
          headers={["Library", "Bundle cost (min+gzip)", "React components", "Theming", "License"]}
          rows={COMPARISON}
        />
        <p style={{ fontSize: 12, color: "var(--muted)", textAlign: "center" }}>
          Sizes measured via bundlephobia, September 2026. “Core” excludes the Floating UI positioning engine
          (shared with many popover/tooltip libraries, so you may already ship it).
        </p>
      </section>

      {/* ---------- Docs ---------- */}
      <section id="docs" style={{ maxWidth: 800, margin: "0 auto", padding: "30px 28px 60px" }}>
        <h2 style={{ fontSize: 24, marginBottom: 6, textAlign: "center" }}>Documentation</h2>
        <p style={{ color: "var(--muted)", textAlign: "center", marginBottom: 32 }}>
          The essentials — the full API reference lives in the{" "}
          <a href={GITHUB_URL} target="_blank" rel="noreferrer" style={{ color: "var(--brand)" }}>
            README
          </a>
          .
        </p>

        <h3 style={docH3}>1 · Quick start</h3>
        <CodeBlock code={QUICKSTART} />

        <h3 style={docH3}>2 · Theme with CSS variables (zero code)</h3>
        <p style={docP}>
          Every visual decision of the default card is a <code>--tour-*</code> variable with a sensible fallback. Scope
          them under a class and pass it as <code>classNames=&#123;&#123; root: "my-tour" &#125;&#125;</code>, or inline
          via the <code>theme</code> prop:
        </p>
        <CodeBlock code={THEME_CSS} />

        <h3 style={docH3}>3 · Or bring your own components (fully headless)</h3>
        <p style={docP}>
          Replace the card entirely with <code>components=&#123;&#123; Card &#125;&#125;</code>. You receive the whole
          tour state and controls as typed props — the library keeps handling positioning, the spotlight and
          animations. The gradient “Brand” flavor in the playground above is exactly this.
        </p>
        <CodeBlock code={CUSTOM_CARD} />

        <h3 id="api" style={{ ...docH3, fontSize: 20, marginTop: 44 }}>API reference</h3>
        <p style={docP}>
          Everything below is fully typed — your editor shows these same descriptions via IntelliSense.
        </p>

        <h4 style={docH3}>&lt;TourProvider&gt; props</h4>
        <ApiTable headers={["Prop", "Type", "Default", "Description"]} rows={PROVIDER_PROPS} />

        <h4 style={docH3}>TourStep</h4>
        <ApiTable headers={["Field", "Type", "Default", "Description"]} rows={STEP_PROPS} />

        <h4 style={docH3}>useTour()</h4>
        <p style={docP}>
          Call it anywhere under the provider — ideal for “restart tour” menu items or driving the tour from app
          logic. Custom Cards receive all of this as props too.
        </p>
        <ApiTable headers={["Member", "Type", "Description"]} rows={USETOUR_PROPS} />

        <h4 style={docH3}>CSS variables</h4>
        <p style={docP}>
          All accepted by the default card and overlay:{" "}
          <code>
            --tour-bg, --tour-fg, --tour-muted, --tour-accent, --tour-accent-fg, --tour-radius, --tour-shadow,
            --tour-border, --tour-font, --tour-max-width, --tour-padding, --tour-arrow-size, --tour-overlay-color,
            --tour-z-index
          </code>
        </p>
      </section>

      </main>

      {/* ---------- Footer ---------- */}
      <footer
        style={{
          borderTop: "1px solid var(--line)",
          padding: "26px 28px",
          textAlign: "center",
          fontSize: 13,
          color: "var(--muted)",
        }}
      >
        MIT licensed ·{" "}
        <a href={GITHUB_URL} target="_blank" rel="noreferrer" style={{ color: "var(--brand)" }}>
          GitHub
        </a>{" "}
        ·{" "}
        <a href="https://www.npmjs.com/package/react-headless-tour" target="_blank" rel="noreferrer" style={{ color: "var(--brand)" }}>
          npm
        </a>
      </footer>
    </div>
  );
}

const navLink: React.CSSProperties = { color: "var(--muted)", textDecoration: "none" };
const docH3: React.CSSProperties = { fontSize: 16, margin: "28px 0 10px" };
const docP: React.CSSProperties = { fontSize: 14, color: "var(--muted)", lineHeight: 1.65, marginBottom: 12 };

/* ---------------- API reference data ---------------- */

type Row = [name: string, type: string, def: string, description: string];

const PROVIDER_PROPS: Row[] = [
  ["steps", "TourStep[]", "—", "The tour definition. Required."],
  ["autoStart", "boolean", "false", "Start the tour automatically on mount."],
  ["stepIndex", "number", "—", "Controlled mode: you own the active step index. Pair with onStepChange."],
  ["onStepChange", "(index, step) => void", "—", "Fires whenever the active step changes (buttons, keyboard or goTo)."],
  ["onStart", "() => void", "—", "Fires when the tour starts."],
  ["onStop", "(reason, lastIndex) => void", "—", "Fires when the tour ends. reason: \"finished\" | \"skipped\" | \"escape\" | \"mask\" | \"programmatic\"."],
  ["components", "{ Card?, Arrow? }", "—", "Replace the card and/or arrow with your own components (fully headless)."],
  ["classNames", "TourClassNames", "—", "Class hooks for every rendered part — style with Tailwind, CSS Modules, anything."],
  ["theme", "{ \"--tour-*\": value }", "—", "Inline CSS-variable overrides, applied on the tour root so they always win."],
  ["overlayColor", "string", "rgba(0,0,0,0.55)", "Dimming color. Also themeable via --tour-overlay-color."],
  ["overlayBlur", "number", "0", "Frosted-glass blur behind the overlay, in px."],
  ["showOverlay", "boolean", "true", "Render the dimming overlay at all."],
  ["closeOnMaskClick", "boolean", "false", "Clicking the dimmed area stops the tour."],
  ["keyboard", "boolean", "true", "← → navigate, Enter advances, Esc stops."],
  ["spotlightPadding", "number", "8", "Space between the target and the spotlight edge, in px."],
  ["spotlightRadius", "number", "8", "Corner radius of the spotlight hole, in px."],
  ["offset", "number", "12", "Gap between the target and the popover, in px."],
  ["lockScroll", "boolean", "false", "Lock body scroll while the tour is active."],
  ["scrollIntoViewOptions", "ScrollIntoViewOptions", "smooth / center", "How targets are auto-scrolled into view."],
  ["portalContainer", "Element", "document.body", "Where the tour UI is portaled."],
  ["zIndex", "number", "10000", "z-index of the tour root. Also --tour-z-index."],
  ["labels", "{ next?, prev?, finish?, skip?, progress? }", "—", "Texts for the default card — plain strings or nodes, i18n-ready."],
];

const STEP_PROPS: Row[] = [
  ["target", "string | () => Element | null", "—", "CSS selector or resolver for the element to highlight. Omit for a centered modal step."],
  ["title", "ReactNode", "—", "Heading shown by the default card (custom cards receive the whole step)."],
  ["content", "ReactNode", "—", "Body shown by the default card."],
  ["placement", "\"top\" | \"bottom\" | \"left\" | \"right\" (+ -start / -end)", "\"bottom\"", "Preferred popover side. Flips and shifts automatically when space runs out."],
  ["interactable", "boolean", "false", "Let the user click/type on the highlighted element during the step."],
  ["spotlightPadding", "number", "provider value", "Per-step override of the spotlight padding."],
  ["spotlightRadius", "number", "provider value", "Per-step override of the spotlight corner radius."],
  ["disableScroll", "boolean", "false", "Skip auto-scrolling the target into view for this step."],
  ["data", "unknown", "—", "Free-form payload passed through to a custom Card."],
  ["onEnter / onExit", "(step, index) => void", "—", "Lifecycle hooks — e.g. navigate to another page in onEnter for multi-page tours."],
];

const USETOUR_PROPS: string[][] = [
  ["isActive", "boolean", "Whether the tour is running."],
  ["stepIndex / totalSteps", "number", "Active step index (-1 when off) and total step count."],
  ["step", "TourStep | null", "The active step object."],
  ["isFirst / isLast", "boolean", "Position helpers for building custom cards."],
  ["start(atIndex?)", "function", "Start the tour, optionally at a specific step."],
  ["stop(reason?)", "function", "Stop the tour."],
  ["next() / prev() / goTo(i)", "function", "Navigate between steps."],
];

const COMPARISON: [string, string, string, string, string][] = [
  ["react-headless-tour", "12.3 kB (4.5 kB core)", "✅ React", "✅ Fully headless", "MIT"],
  ["react-joyride", "25.0 kB", "✅ React", "⚠️ Styled, override via props", "MIT"],
  ["intro.js", "17.2 kB", "❌ Vanilla + wrapper", "⚠️ Theme via CSS overrides", "AGPL / paid commercial"],
  ["driver.js", "7.2 kB", "❌ Vanilla", "⚠️ Theme via CSS overrides", "MIT"],
];

function ApiTable({ rows, headers }: { rows: string[][]; headers: string[] }) {
  return (
    <div style={{ overflowX: "auto", border: "1px solid var(--line)", borderRadius: 12, margin: "8px 0 20px" }}>
      <table style={{ borderCollapse: "collapse", width: "100%", fontSize: 13, background: "var(--panel)" }}>
        <thead>
          <tr>
            {headers.map((h) => (
              <th
                key={h}
                scope="col"
                style={{
                  textAlign: "left",
                  padding: "10px 14px",
                  borderBottom: "1px solid var(--line)",
                  background: "var(--bg)",
                  fontWeight: 600,
                  whiteSpace: "nowrap",
                }}
              >
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((r) => (
            <tr key={r[0]}>
              {r.map((cell, i) => (
                <td
                  key={i}
                  style={{
                    padding: "9px 14px",
                    borderBottom: "1px solid var(--line)",
                    verticalAlign: "top",
                    lineHeight: 1.5,
                    ...(i === 0
                      ? { fontFamily: "ui-monospace, Menlo, monospace", whiteSpace: "nowrap", color: "var(--brand)", fontWeight: 600 }
                      : i < r.length - 1
                        ? { fontFamily: "ui-monospace, Menlo, monospace", fontSize: 12, color: "var(--muted)" }
                        : { color: "var(--muted)" }),
                  }}
                >
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default function Page() {
  const [flavor, setFlavor] = useState<Flavor>("default");

  return (
    <TourProvider
      steps={steps}
      classNames={flavor === "dark" ? { root: "themed-tour" } : undefined}
      components={flavor === "brand" ? { Card: BrandCard } : undefined}
      overlayBlur={flavor === "brand" ? 2 : 0}
      closeOnMaskClick
    >
      <Landing flavor={flavor} setFlavor={setFlavor} />
    </TourProvider>
  );
}
