---
name: Co-Watcher
colors:
  surface: '#131316'
  surface-dim: '#131316'
  surface-bright: '#39393c'
  surface-container-lowest: '#0e0e11'
  surface-container-low: '#1b1b1e'
  surface-container: '#1f1f22'
  surface-container-high: '#2a2a2d'
  surface-container-highest: '#353438'
  on-surface: '#e4e1e6'
  on-surface-variant: '#c2c6d6'
  inverse-surface: '#e4e1e6'
  inverse-on-surface: '#303033'
  outline: '#8c909f'
  outline-variant: '#424754'
  surface-tint: '#adc6ff'
  primary: '#adc6ff'
  on-primary: '#002e6a'
  primary-container: '#4d8eff'
  on-primary-container: '#00285d'
  inverse-primary: '#005ac2'
  secondary: '#4edea3'
  on-secondary: '#003824'
  secondary-container: '#00a572'
  on-secondary-container: '#00311f'
  tertiary: '#ffb2b7'
  on-tertiary: '#67001b'
  tertiary-container: '#ff516a'
  on-tertiary-container: '#5b0017'
  error: '#ffb4ab'
  on-error: '#690005'
  error-container: '#93000a'
  on-error-container: '#ffdad6'
  primary-fixed: '#d8e2ff'
  primary-fixed-dim: '#adc6ff'
  on-primary-fixed: '#001a42'
  on-primary-fixed-variant: '#004395'
  secondary-fixed: '#6ffbbe'
  secondary-fixed-dim: '#4edea3'
  on-secondary-fixed: '#002113'
  on-secondary-fixed-variant: '#005236'
  tertiary-fixed: '#ffdadb'
  tertiary-fixed-dim: '#ffb2b7'
  on-tertiary-fixed: '#40000d'
  on-tertiary-fixed-variant: '#92002a'
  background: '#131316'
  on-background: '#e4e1e6'
  surface-variant: '#353438'
typography:
  headline-lg:
    fontFamily: Geist
    fontSize: 28px
    fontWeight: '600'
    lineHeight: 36px
    letterSpacing: -0.02em
  headline-md:
    fontFamily: Geist
    fontSize: 20px
    fontWeight: '600'
    lineHeight: 28px
    letterSpacing: -0.015em
  headline-sm:
    fontFamily: Geist
    fontSize: 16px
    fontWeight: '600'
    lineHeight: 24px
    letterSpacing: -0.01em
  body-lg:
    fontFamily: Inter
    fontSize: 15px
    fontWeight: '400'
    lineHeight: 24px
  body-md:
    fontFamily: Inter
    fontSize: 13.5px
    fontWeight: '400'
    lineHeight: 21px
  body-sm:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '400'
    lineHeight: 18px
  body-compact:
    fontFamily: Inter
    fontSize: 13.5px
    fontWeight: '400'
    lineHeight: 20px
  caption-sm:
    fontFamily: JetBrains Mono
    fontSize: 11px
    fontWeight: '500'
    lineHeight: 15px
  micro:
    fontFamily: JetBrains Mono
    fontSize: 10px
    fontWeight: '500'
    lineHeight: 14px
  nano:
    fontFamily: JetBrains Mono
    fontSize: 9px
    fontWeight: '600'
    lineHeight: 12px
  label-md:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '500'
    lineHeight: 16px
    letterSpacing: 0.01em
  label-mono:
    fontFamily: JetBrains Mono
    fontSize: 11.5px
    fontWeight: '500'
    lineHeight: 14px
    letterSpacing: 0.02em
  timestamp:
    fontFamily: JetBrains Mono
    fontSize: 11px
    fontWeight: '600'
    lineHeight: 14px
    letterSpacing: 0.03em
rounded:
  sm: 0.125rem
  DEFAULT: 0.25rem
  md: 0.375rem
  lg: 0.5rem
  xl: 0.75rem
  full: 9999px
spacing:
  space-2xs: 0.25rem
  space-xs: 0.5rem
  space-sm: 0.75rem
  space-md: 1rem
  space-lg: 1.5rem
  space-xl: 2rem
  space-2xl: 3rem
  sidebar-width: 420px
  composer-height: 56px
  timeline-marker-size: 8px
---

## Brand & Style
The interface is engineered for ambient co-presence: watching long-form video alongside an observant, intelligent companion without sensory overload. The aesthetic blends modern utilitarian minimalism with cinematic focus. It draws inspiration from YouTube’s dark canvas and developer-grade AI workbenches, stripping out clutter, noisy badges, and saturated accents in favor of a deep zinc workspace where video takes center stage.

The emotional tone is calm, attentive, and precise. Interactions are frictionless and quiet; AI presence is signaled through precise gem-toned markers that punctuate the timeline and feed like quiet annotations in a notebook.

## Colors
The palette is built around an ultra-dark zinc base (`#0f0f12`) that prevents eye fatigue during extended video sessions. UI borders use subtle slate tones (`#27272a` and `#1f1f23`) to define structural zones without high-contrast friction.

AI insights, markers, and chronological metadata rely on an elegant set of gem tones:
- **Sapphire Blue** (`#3b82f6`): Structural observations, navigational anchors, and active links.
- **Emerald Green** (`#10b981`): Confirmations, agreement, source verifications, and factual citations.
- **Ruby / Rose** (`#f43f5e`): Critiques, counter-arguments, and flagged moments.
- **Amber Topaz** (`#f59e0b`): Key takeaways, context shifts, and questions.
- **Amethyst Purple** (`#a855f7`): Deep syntheses, lateral connections, and abstract commentary.

Neutral surface tiers:
- Canvas/Base: `#0f0f12`
- Layer 1 (Panels, Sidebars): `#141418`
- Layer 2 (Cards, Floating Controls): `#1a1a20`
- Layer 3 (Hover States, Input Troughs): `#22222a`
- Subtle Outline: `#27272e`
- Text Primary: `#f4f4f5`
- Text Secondary: `#a1a1aa`
- Text Muted: `#71717a`

## Typography
Typography is tuned for sustained readability against dark backgrounds. Headlines utilize **Geist** for crisp geometry, tight tracking, and modern authority. Running narrative, AI responses, and user comments leverage **Inter**, offering optical balance and high legibility at compact scales.

Timestamps, video codes, telemetry, and duration markers use **JetBrains Mono** to guarantee tabular number alignment across feeds and timelines. Line-heights are kept generous to prevent optical fatigue during dense exchanges.

## Layout & Spacing
The layout adheres to an asynchronous split-screen architecture optimized for 16:9 media consumption:
- **Primary Stage (Left / Dynamic Fluid)**: Houses the video player and embedded scrubber timeline. Dynamically expands to fill available viewport space up to a max ratio, maintaining theater balance.
- **Companion Dock (Right / Fixed Grid)**: A dedicated 420px panel (scalable between 380px and 460px on wider screens) containing the synchronized feed, AI insights, topic branches, and the bottom composer.
- **Scrubber Synchronization**: Timeline markers sit flush above the standard YouTube controls, matching timestamp items in the companion stream.
- **Mobile / Narrow Tablet Breakpoint (< 1024px)**: Stacks vertically with the player pinned to the top and the companion stream transforming into a sliding bottom drawer.

## Elevation & Depth
Depth is created through tonal layering and hair-thin border definitions rather than aggressive shadows.

1. **Surface 0 (Canvas)**: `#0f0f12` — Base container for the video canvas.
2. **Surface 1 (Side Rail / Companion Stream)**: `#141418` — Separated by a 1px border (`#1f1f26`).
3. **Surface 2 (Comment / Insight Cards)**: `#1a1a20` — Bordered with `#27272e`. On hover, the border subtly lifts to `#3f3f46`.
4. **Surface 3 (Floating Composer & Dropdowns)**: `#1f1f26` with a diffused ambient shadow (`0 8px 32px rgba(0, 0, 0, 0.45)`) and a 1px border (`#32323a`).
5. **Backdrop Filters**: Floating tooltips and transport overlays employ a subtle 12px blur (`backdrop-filter: blur(12px)`) over `#141418cc` to preserve spatial context.

## Shapes
The design adopts a refined, soft aesthetic (Level 1):
- **Micro UI & Pills (Timestamps, Tags, Badges)**: 4px–6px radius to keep elements clean, compact, and architectural.
- **Cards & Chat Modules**: 8px (`0.5rem`) radius for structured containment without bubbly visual excess.
- **Panels & Player Shell**: 12px (`0.75rem`) outer bounding radius.
- **Bottom Composer**: Pill-inspired 24px container or 12px softly rounded dock that houses the input cleanly.

## Components

### Buttons
- **Primary**: Solid white or light zinc background (`#f4f4f5`) with dark text (`#0f0f12`), 6px border radius, medium weight. Used sparingly for primary co-watch actions (e.g., "Summarize Segment", "Share Thread").
- **Ghost/Subtle**: `#1a1a20` with 1px border (`#27272e`), hover state transitions to `#22222a`. Used for playback syncing, filter toggles, and clip export.
- **Icon Actions**: Pure ghost style (`transparent`), `#a1a1aa` foreground, shifting to `#ffffff` and `#27272e` on hover.

### Timestamp Markers & Badges
- Displayed as monospace chips (`label-mono`) featuring a gem-colored indicator dot (6px circle).
- Hovering a timestamp reveals the thumbnail preview and highlights the matching position on the timeline scrubber.
- Colored variations indicate insight category (Sapphire: Key Moment; Emerald: Fact Check; Ruby: Disagreement; Amber: Concept; Amethyst: Deep Synthesis).

### Companion Cards & Comment Feeds
- Compact, dense, low-margin blocks styled after modern comment threads.
- Avatar is 28px square with a 6px radius. AI companion uses a designated monochromatic icon paired with the relevant gem accent tint.
- Meta row displays: Author, Timestamp Chip, and Relative Time.
- Content typography uses `body-md` with 21px line-height.

### Bottom Composer
- Modeled after streamlined conversational AI bars: a floating or bottom-docked rounded input container (`#1a1a20`) with 1px border (`#2b2b34`).
- Features a dynamic autogrow textarea, integrated timestamp pin button ("Tag at 12:44"), model mode switcher (Concise, Deep Dive, Socratic), and an arrow send action.
- Focused state gains a delicate glow: `0 0 0 1px #3b82f6`.

### Timeline Scrubber Annotations
- Gemstone nodes embedded along the video progress track.
- 8px diamonds or rounded capsules that expand to 10px on hover, displaying a floating popover card with the companion's comment preview.