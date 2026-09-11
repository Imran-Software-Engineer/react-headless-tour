# react-headless-tour

[![npm version](https://img.shields.io/npm/v/react-headless-tour.svg)](https://www.npmjs.com/package/react-headless-tour)
[![npm downloads](https://img.shields.io/npm/dm/react-headless-tour.svg)](https://www.npmjs.com/package/react-headless-tour)
[![bundle size](https://img.shields.io/bundlephobia/minzip/react-headless-tour)](https://bundlephobia.com/package/react-headless-tour)
[![license](https://img.shields.io/npm/l/react-headless-tour.svg)](./LICENSE)

Fully customizable, **headless** product tour / onboarding library for React & Next.js.

All the logic, none of the opinions. The library owns targeting, positioning, the animated spotlight, keyboard navigation and state — you own every pixel. Restyle it with CSS variables, class names, or replace whole components with your own.

- 🪶 **Tiny** — ~4.5 kB min+gzip of library code (~12 kB total with its single dependency, Floating UI). No animation library.
- 🎨 **Three levels of theming** — CSS variables → per-part `classNames` → full component replacement
- ✨ **Springy spotlight** — an SVG-mask cutout that glides smoothly between targets via pure CSS transitions
- 📐 **Bulletproof positioning** — Floating UI under the hood: auto flip, shift, arrow
- ⌨️ **Keyboard navigation** — `←` `→` `Enter` `Esc` out of the box
- 🖱️ **Interactable steps** — let users click the highlighted element mid-tour
- 🧭 **Follows moving targets** — survives scrolling, resizes, sticky headers, layout shifts
- 🧩 **Centered modal steps** — omit `target` for welcome/outro screens
- 🌐 **SSR-safe** — works with the Next.js App Router (ships `"use client"`), no `window` access on the server
- ♿ **Accessible** — `role="dialog"` with step announcements, focus management, `prefers-reduced-motion` support; the demo audits clean with axe-core
- 🔷 **TypeScript-first** — every prop and slot is fully typed

## Why this over the alternatives?

| Library | Bundle cost (min+gzip) | React components | Theming | License |
| --- | --- | --- | --- | --- |
| **react-headless-tour** | **12.3 kB (4.5 kB core)** | ✅ React | ✅ Fully headless | MIT |
| react-joyride | 25.0 kB | ✅ React | ⚠️ Styled, override via props | MIT |
| intro.js | 17.2 kB | ❌ Vanilla + wrapper | ⚠️ Theme via CSS overrides | AGPL / paid commercial |
| driver.js | 7.2 kB | ❌ Vanilla | ⚠️ Theme via CSS overrides | MIT |

<sub>Sizes via bundlephobia, September 2026. "Core" excludes the Floating UI positioning engine, which many apps already ship via other popover/tooltip libraries.</sub>

## Install

```bash
npm install react-headless-tour
```

React 18 or 19. The only dependency is `@floating-ui/react-dom` (positioning); animations are pure CSS.

## Quick start

```tsx
"use client"; // Next.js App Router

import { TourProvider, useTour, type TourStep } from "react-headless-tour";

const steps: TourStep[] = [
  { title: "Welcome 👋", content: "No target = centered modal step." },
  { target: "#stats", title: "Your metrics", content: "Everything at a glance." },
  { target: "#new-project", title: "Create a project", placement: "left", interactable: true },
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
}
```

That's it — the default card is intentionally neutral and already looks fine. Now make it yours:

## Theming

### Level 1 — CSS variables (zero code)

Every visual decision of the default UI is a CSS variable with a fallback. Set them globally, on a wrapper class, or inline via the `theme` prop:

```css
/* e.g. in your globals.css */
.my-tour {
  --tour-bg: #16181d;
  --tour-fg: #f9fafb;
  --tour-muted: #9ca3af;
  --tour-accent: #4f46e5;      /* primary button */
  --tour-accent-fg: #ffffff;
  --tour-radius: 14px;
  --tour-shadow: 0 10px 38px rgba(0, 0, 0, 0.35);
  --tour-border: 1px solid rgba(255, 255, 255, 0.14);
  --tour-overlay-color: rgba(10, 12, 24, 0.68);
  --tour-max-width: 340px;
  --tour-padding: 16px;
  --tour-font: "Inter", sans-serif;
  --tour-arrow-size: 12px;
  --tour-z-index: 10000;
}
```

```tsx
<TourProvider steps={steps} classNames={{ root: "my-tour" }} />
// or inline:
<TourProvider steps={steps} theme={{ "--tour-accent": "#7c3aed" }} />
```

Because the variables cascade from the tour root, they automatically follow your app's light/dark mode if you define them under your theme selectors.

### Level 2 — class names (Tailwind, CSS Modules, …)

Every rendered part exposes a class hook and a stable `data-tour-*` attribute:

```tsx
<TourProvider
  steps={steps}
  classNames={{
    card: "rounded-2xl bg-white shadow-xl p-4",
    title: "font-bold text-slate-900",
    content: "text-sm text-slate-500",
    primaryButton: "bg-indigo-600 text-white rounded-lg px-3 py-1.5",
    skipButton: "text-slate-400",
  }}
/>
```

Available keys: `root`, `overlay`, `popover`, `card`, `title`, `content`, `footer`, `progress`, `navButton`, `primaryButton`, `skipButton`, `arrow`.

### Level 3 — bring your own components (fully headless)

Replace the card entirely. You get the full tour state and controls as props; the library still handles positioning, the spotlight and animations:

```tsx
import type { TourCardProps } from "react-headless-tour";

function MyCard({ step, stepIndex, totalSteps, isFirst, isLast, next, prev, stop, arrow }: TourCardProps) {
  return (
    <div className="my-design-system-popover">
      {arrow /* optional — skip it for an arrowless design */}
      <h3>{step.title}</h3>
      <p>{step.content}</p>
      <progress value={stepIndex + 1} max={totalSteps} />
      {!isFirst && <button onClick={prev}>Back</button>}
      <button onClick={next}>{isLast ? "Done" : "Next"}</button>
      <button onClick={() => stop("skipped")}>Skip</button>
    </div>
  );
}

<TourProvider steps={steps} components={{ Card: MyCard, Arrow: MyArrow }} />
```

Pass anything your card needs per step through `step.data`.

## API

### `<TourProvider>`

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `steps` | `TourStep[]` | — | The tour definition |
| `autoStart` | `boolean` | `false` | Start on mount |
| `stepIndex` / `onStepChange` | `number` / `(i, step) => void` | — | Controlled mode |
| `onStart` / `onStop` | callbacks | — | `onStop` receives a reason: `finished`, `skipped`, `escape`, `mask`, `programmatic` |
| `components` | `{ Card?, Arrow? }` | — | Component slots |
| `classNames` | `TourClassNames` | — | Class hooks per part |
| `theme` | CSS vars object | — | Inline `--tour-*` overrides |
| `overlayColor` | `string` | `rgba(0,0,0,0.55)` | Dim color |
| `overlayBlur` | `number` | `0` | Frosted-glass blur (px) |
| `showOverlay` | `boolean` | `true` | Render the dim layer |
| `closeOnMaskClick` | `boolean` | `false` | Click outside to stop |
| `keyboard` | `boolean` | `true` | Arrow keys / Enter / Esc |
| `spotlightPadding` | `number` | `8` | Space around targets (px) |
| `spotlightRadius` | `number` | `8` | Spotlight corner radius (px) |
| `offset` | `number` | `12` | Target ↔ popover gap (px) |
| `lockScroll` | `boolean` | `false` | Lock body scroll while active |
| `scrollIntoViewOptions` | `ScrollIntoViewOptions` | smooth/center | Auto-scroll behavior |
| `portalContainer` | `Element` | `document.body` | Portal destination |
| `zIndex` | `number` | `10000` | Root z-index |
| `labels` | object | — | `next`, `prev`, `finish`, `skip`, `progress(i, n)` — i18n-ready |

### `TourStep`

| Field | Type | Description |
| --- | --- | --- |
| `target` | `string \| () => Element \| null` | CSS selector or resolver. Omit for a centered modal step |
| `title`, `content` | `ReactNode` | Used by the default card |
| `placement` | `"top" \| "bottom" \| "left" \| "right"` (+ `-start`/`-end`) | Preferred side; auto-flips |
| `interactable` | `boolean` | Allow clicks on the highlighted element |
| `spotlightPadding`, `spotlightRadius` | `number` | Per-step overrides |
| `disableScroll` | `boolean` | Skip auto scroll-into-view |
| `data` | `unknown` | Free-form payload for custom cards |
| `onEnter`, `onExit` | `(step, index) => void` | Step lifecycle hooks |

### `useTour()`

Call it anywhere under the provider — perfect for "restart tour" menu items or driving the tour from app logic. Custom Cards receive all of this as props too.

| Member | Type | Description |
| --- | --- | --- |
| `isActive` | `boolean` | Whether the tour is running |
| `stepIndex` / `totalSteps` | `number` | Active step index (`-1` when off) and total step count |
| `step` | `TourStep \| null` | The active step object |
| `isFirst` / `isLast` | `boolean` | Position helpers for building custom cards |
| `start(atIndex?)` | `function` | Start the tour, optionally at a specific step |
| `stop(reason?)` | `function` | Stop the tour |
| `next()` / `prev()` / `goTo(i)` | `function` | Navigate between steps |

## Multi-page tours

Tours are not limited to a single page. Mount `TourProvider` once in your root layout (so it survives route changes) and navigate inside a step's `onEnter`. If a step's target isn't in the DOM yet, the library keeps re-resolving it every frame — the popover simply attaches once the new page renders:

```tsx
// app/providers.tsx ("use client"), rendered inside app/layout.tsx
function Providers({ children }: { children: React.ReactNode }) {
  const router = useRouter();

  const steps: TourStep[] = [
    { target: "#dashboard-stats", title: "Your metrics" },
    {
      target: "#settings-form",
      title: "Configure your workspace",
      onEnter: () => router.push("/settings"), // navigate, target resolves after render
    },
    {
      target: "#dashboard-stats",
      title: "Back home",
      onEnter: () => router.push("/"),
    },
  ];

  return <TourProvider steps={steps}>{children}</TourProvider>;
}
```

Tour state lives in React context above your pages, so `next`/`prev`/`stepIndex` all keep working across navigations. (For back-navigation with `prev`, trigger the route change from `onEnter` of the step you land on — as above — rather than from `onExit`.)

## Demo

The [`demo/`](demo) folder contains a Next.js app showing all three theming levels:

```bash
cd demo && npm install && npm run dev
```

## License

MIT
