# Landing page jitter on 120Hz desktop monitors

Source of truth for this investigation. The client only has a 120Hz desktop, so we
cannot fully confirm any fix ourselves — only they can, after a deploy. **Update the
attempts log below every time something ships, and record the client's verdict before
starting further work**, so we don't re-try something that was already ruled out.

## Symptom (as reported by the client)

- Only the **landing page** (`/`) jitters. Every other page is smooth.
- Reproducible on a **120Hz desktop monitor**, in both **Chrome and Edge**.
- The **first** jitter happens around the **"From setup to scale, we stay with you"**
  section (`ServiceJourneySection`) or the **"How it works"** section
  (`HowItWorksSection`).
- After that point, jitter starts happening across other sections of the page too.
- Smooth on normal 60Hz (and 30Hz) laptop displays.
- Smooth on a 120Hz **mobile** device — no jitter there at all.

## Root cause analysis

### 1. Primary cause — global Lenis smooth-scroll hijack mounted mid-page

[`components/ScrollStack.tsx`](components/ScrollStack.tsx) constructs a `Lenis`
instance with `useWindowScroll: true`, which takes over scrolling for the **entire
window**, not just its own section. Its only consumer anywhere in the repo is
[`HowItWorksSection.tsx:117`](features/marketing/components/sections/HowItWorksSection.tsx#L117)
— the landing page's "How it works" section. That's why only the landing page is
affected.

Two gates explain the rest of the pattern:

- `useDesktopStack()` in `HowItWorksSection.tsx` only mounts `ScrollStack` when
  `(min-width: 768px) and (hover: hover) and (pointer: fine)` matches — false on touch
  devices, so **Lenis never mounts on mobile**. That's why 120Hz mobile is clean.
- `HowItWorksSection` and `ServiceJourneySection` are `next/dynamic` imports in
  [`LandingPage.tsx`](features/marketing/components/LandingPage.tsx#L17-L18). They
  hydrate as the user scrolls down to them, so Lenis is constructed **mid-scroll**,
  right at those two sections — matching exactly where the client sees the first
  jitter.

Once Lenis takes over, **all** scrolling on the page moves from compositor-driven
native scroll to main-thread `window.scrollTo()` calls inside a `requestAnimationFrame`
loop. That's why jitter then spreads to other sections too.

**Why 120Hz specifically:** compositor scroll is refresh-rate agnostic; main-thread
scroll is not. At 120Hz the frame budget is 8.33ms instead of 16.7ms. Once Lenis is
driving scroll, every frame has to fit: Lenis's own rAF tick + `ScrollStack`'s per-card
transform math and style writes + framer-motion's rAF loop for ~8 `repeat: Infinity`
animations elsewhere on the page + 2 marquees with 4x duplicated DOM + a full-width
`backdrop-blur-xl` fixed header. Work that fits in 16.7ms can overrun 8.33ms — each
overrun is a dropped frame, perceived as jitter/stutter.

**Config bug found:** `ScrollStack` passes `duration: 1.2`, `easing`, **and**
`lerp: 0.1` together into `new Lenis(...)`. Checked against the installed Lenis 1.3.23
source (`node_modules/lenis/dist/lenis.mjs`): `Animate.advance` prefers the
`duration`+`easing` branch over `lerp`, so `lerp: 0.1` is dead config, and every wheel
notch starts a fresh 1.2s eased tween. At 120Hz that tail spreads across twice as many
frames at half the delta each, which can round to the same device pixel across several
consecutive frames — perceived as stair-step micro-stutter.

### 2. Contributing — `MagnetLines` forced layout on every pointermove

[`components/fancy/MagnetLines.tsx`](components/fancy/MagnetLines.tsx) attaches an
unthrottled, non-rAF-batched `pointermove` listener that loops every `<span>` calling
`getBoundingClientRect()` (forced synchronous layout) and writing a style property.
Used 3x on the landing page in `ProductDevelopmentSection.tsx` (8×11 + 5×8 + 7×8 = 184
spans total), each also carrying a permanent `will-change: transform`. Desktop-only
(no pointermove while scrolling on touch); Chrome also dispatches a synthetic
mousemove after scroll ends, so this can fire mid-scroll.

### 3. Contributing — always-on per-frame work

~8 `repeat: Infinity` framer-motion loops, a 3s `setInterval` in `ChatBubbles.tsx`
driving layout springs forever (no visibility gate), a 5s `setInterval` in
`ProductDevelopmentSection.tsx`, an animated `transform` string (not decomposed
x/y/rotate) on a `preserve-3d` cube in `ServiceJourneySection.tsx`, and marquees
rendering their content 4x. None of these cause jitter alone at 60Hz; combined they
push the halved 120Hz frame budget over the edge once Lenis has moved scroll onto the
main thread.

## Ruled out (do not re-investigate)

- **Lenis's own interpolation is not frame-rate dependent.** v1.3.23 uses
  `damp(x, y, lambda, deltaTime)`, which is deltaTime-corrected. The refresh-rate
  sensitivity comes from doing scroll on the main thread at all, not from Lenis's math.
- **Not a CSS `animation-timeline` / native scroll-driven-animation bug** — the repo
  uses none.
- **Not mobile-related** — `ScrollStack`/Lenis never mounts on touch devices
  (`hover: hover` + `pointer: fine` gate), which is consistent with mobile being clean.

## How to verify without a 120Hz monitor

Launch Chrome with vsync disabled so `requestAnimationFrame` runs unthrottled at
several hundred fps — this exaggerates exactly this class of frame-budget bug and lets
us reproduce jank on ordinary 60Hz dev hardware:

```
chrome.exe --disable-gpu-vsync --disable-frame-rate-limit --user-data-dir=%TEMP%\chrome-perf http://localhost:3000
```

Before the fix, scrolling past "How it works" in this mode visibly stutters. Also use
DevTools → Performance to record a scroll pass and check for long tasks / dropped
frames, and confirm no rAF loop from `ScrollStack` remains after the fix.

## Attempts log

| Date | Change | Commit/PR | Deployed | Client verdict | Notes |
|---|---|---|---|---|---|
| 2026-08-07 | Removed Lenis from `ScrollStack`; switched card pinning to native `position: sticky` | _pending_ | no | untested | Primary fix — returns scroll to compositor, refresh-rate independent |
| 2026-08-07 | Batched `MagnetLines` pointermove handling through rAF, cached rects instead of measuring per-event, removed permanent `will-change` | _pending_ | no | superseded | First attempt cached each span's center at mount and only re-measured on `ResizeObserver` (size change). Broke direction-tracking: all 3 `MagnetLines` instances in `ProductDevelopmentSection.tsx` sit inside a `framer-motion` wrapper that animates `y: 28 → 0` on scroll-into-view — the container's on-screen *position* shifts without its *size* changing, so `ResizeObserver` never fires and the cached centers go stale. Caught by manual testing (client: "magnetic lines are not reacting to cursor"). |
| 2026-08-08 | Fixed `MagnetLines`: still batch pointermove to one measure+update pass per animation frame (via rAF), but measure `getBoundingClientRect()` fresh each time instead of caching | _pending_ | no | untested | Keeps the real perf win (pointermove can fire far more often than the screen repaints; collapsing to 1x/frame is the expensive part to cut) while staying always-correct like the original, since geometry is never assumed stable across frames. Do not reintroduce a persistent center cache for this component — position-only shifts from ancestor transforms will break it again. |
| _not started_ | Gate `setInterval`/infinite-loop animations behind visibility, fix `ServiceJourneySection` transform animation, reduce marquee DOM repeat, reduce header backdrop-blur | — | no | untested | Only do this if jitter persists after the two fixes above |

**Verdict legend:** `untested` (not yet deployed/confirmed by client) · `fixed` ·
`no change` · `partial` (better but not gone).
