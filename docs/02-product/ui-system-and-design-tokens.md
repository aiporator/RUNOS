# RunOS — UI System & Design Tokens

> Owner: UX Director / Head of Product Design
> Status: v1.0 — execution-ready. Conforms to `docs/00-foundation/canonical-brief.md`.
> Implementation target: Tailwind + CSS custom properties (web), token pipeline via Style Dictionary → web CSS vars, React Native theme object, Figma variables. One token source of truth.

---

## 1. Design Principles

1. **Speed is the brand.** Every interaction budgeted: <100 ms feedback, <400 ms navigation, optimistic UI with undo instead of confirmation walls. If it feels slow, it's a bug — file it like one.
2. **Clarity over cleverness.** One primary action per screen. Numbers always carry their comparison. Plain-language sentences verify complex configuration (automations, permissions). Stripe-grade information design.
3. **Athletic warmth.** Confident color, celebratory moments (check-ins, PRs, unlocks) with restrained motion; never gamification confetti-spam. Copy is "we run the boring stuff so you can run the club" — short sentences, verbs over adjectives.
4. **White-label-safe by construction.** Club brands own the member experience. Every component consumes *semantic* tokens only; club theming overrides a small, guarded set of tokens and can never produce an inaccessible UI (see §4).
5. **Calm by default, loud when earned.** Organizer surfaces are light-first, quiet, dense-capable. Member surfaces are dark-mode-first, glanceable. Accent color is spent on primary actions and live states only.

---

## 2. Color

### 2.1 Primitives

Brand world: **Pace Orange** (#FF5A1F) on near-black **Track** neutrals. Orange is confidence and motion; Track neutrals keep it premium, not sporty-cheap. Full 50–950 ramps, tuned for contrast at the steps we actually use.

```json
{
  "color": {
    "orange": {
      "50": "#FFF4EE", "100": "#FFE4D6", "200": "#FFC5A8", "300": "#FF9E71",
      "400": "#FF7A42", "500": "#FF5A1F", "600": "#E8440C", "700": "#C13508",
      "800": "#9A2B0B", "900": "#7C250D", "950": "#431004"
    },
    "track": {
      "50": "#F7F7F8", "100": "#EFEFF1", "200": "#DCDDE1", "300": "#C2C4CB",
      "400": "#9A9DA8", "500": "#75798A", "600": "#5B5F6E", "700": "#484B58",
      "800": "#2E3038", "900": "#1B1C21", "925": "#141519", "950": "#0A0A0B"
    },
    "green": {
      "50": "#EFFEF4", "100": "#D8FBE4", "200": "#B3F5CB", "300": "#7BEAA6",
      "400": "#3DD67D", "500": "#16B364", "600": "#0A9150", "700": "#0C7342",
      "800": "#0E5B37", "900": "#0D4B2F", "950": "#042A19"
    },
    "amber": {
      "50": "#FFFAEB", "100": "#FEF0C7", "200": "#FEDF89", "300": "#FEC84B",
      "400": "#FDB022", "500": "#F79009", "600": "#DC6803", "700": "#B54708",
      "800": "#93370D", "900": "#7A2E0E", "950": "#4E1D09"
    },
    "red": {
      "50": "#FEF3F2", "100": "#FEE4E2", "200": "#FECDCA", "300": "#FDA29B",
      "400": "#F97066", "500": "#F04438", "600": "#D92D20", "700": "#B42318",
      "800": "#912018", "900": "#7A271A", "950": "#55160C"
    },
    "blue": {
      "50": "#EFF8FF", "100": "#D1E9FF", "200": "#B2DDFF", "300": "#84CAFF",
      "400": "#53B1FD", "500": "#2E90FA", "600": "#1570EF", "700": "#175CD3",
      "800": "#1849A9", "900": "#194185", "950": "#102A56"
    },
    "violet": {
      "50": "#F5F3FF", "100": "#ECE9FE", "200": "#DDD6FE", "300": "#C3B5FD",
      "400": "#A48AFB", "500": "#875BF7", "600": "#7839EE", "700": "#6927DA",
      "800": "#5720B7", "900": "#491C96", "950": "#2E125E"
    },
    "white": "#FFFFFF",
    "black": "#000000"
  }
}
```

Named primitives (marketing/voice use): **Pace Orange** `orange.500`, **Track Black** `track.950`, **Split Green** `green.500`, **Caution Amber** `amber.500`, **Stop Red** `red.500`, **Tempo Blue** `blue.500`, **Pacer Violet** `violet.500` (reserved exclusively for Pacer/AI affordances).

### 2.2 Semantic tokens — light & dark

Components consume ONLY these. `{}` = primitive reference.

```json
{
  "semantic": {
    "light": {
      "bg/base": "{white}",
      "bg/subtle": "{track.50}",
      "bg/muted": "{track.100}",
      "bg/inverse": "{track.950}",
      "bg/overlay": "rgba(10,10,11,0.55)",
      "surface/raised": "{white}",
      "surface/sunken": "{track.50}",
      "border/default": "{track.200}",
      "border/strong": "{track.300}",
      "border/focus": "{orange.500}",
      "text/primary": "{track.950}",
      "text/secondary": "{track.600}",
      "text/tertiary": "{track.400}",
      "text/inverse": "{white}",
      "text/link": "{orange.600}",
      "accent/default": "{orange.500}",
      "accent/hover": "{orange.600}",
      "accent/active": "{orange.700}",
      "accent/subtle-bg": "{orange.50}",
      "accent/on-accent": "{white}",
      "success/default": "{green.600}", "success/subtle-bg": "{green.50}",
      "warning/default": "{amber.600}", "warning/subtle-bg": "{amber.50}",
      "danger/default":  "{red.600}",   "danger/subtle-bg":  "{red.50}",
      "info/default":    "{blue.600}",  "info/subtle-bg":    "{blue.50}",
      "ai/default": "{violet.600}", "ai/subtle-bg": "{violet.50}",
      "live/default": "{red.500}"
    },
    "dark": {
      "bg/base": "{track.950}",
      "bg/subtle": "{track.925}",
      "bg/muted": "{track.900}",
      "bg/inverse": "{white}",
      "bg/overlay": "rgba(0,0,0,0.65)",
      "surface/raised": "{track.900}",
      "surface/sunken": "{track.925}",
      "border/default": "{track.800}",
      "border/strong": "{track.700}",
      "border/focus": "{orange.400}",
      "text/primary": "{track.50}",
      "text/secondary": "{track.300}",
      "text/tertiary": "{track.500}",
      "text/inverse": "{track.950}",
      "text/link": "{orange.400}",
      "accent/default": "{orange.500}",
      "accent/hover": "{orange.400}",
      "accent/active": "{orange.300}",
      "accent/subtle-bg": "rgba(255,90,31,0.12)",
      "accent/on-accent": "{white}",
      "success/default": "{green.400}", "success/subtle-bg": "rgba(22,179,100,0.14)",
      "warning/default": "{amber.400}", "warning/subtle-bg": "rgba(247,144,9,0.14)",
      "danger/default":  "{red.400}",   "danger/subtle-bg":  "rgba(240,68,56,0.14)",
      "info/default":    "{blue.400}",  "info/subtle-bg":    "rgba(46,144,250,0.14)",
      "ai/default": "{violet.400}", "ai/subtle-bg": "rgba(135,91,247,0.16)",
      "live/default": "{red.400}"
    }
  }
}
```

Usage rules: `accent/*` = primary actions, selection, focus, live progress — nothing else. `ai/*` (Pacer Violet) is never used for non-AI UI, so users always know when AI is speaking. `live/default` only for genuinely live states (Live Day, live campaign) with the pulsing dot.

---

## 3. Typography, Spacing, Radii, Shadows, Motion, Breakpoints

```json
{
  "typography": {
    "family": {
      "sans": "Inter, -apple-system, 'Segoe UI', Roboto, sans-serif",
      "display": "'Inter Display', Inter, sans-serif",
      "mono": "'JetBrains Mono', 'SF Mono', monospace"
    },
    "scale": {
      "display-xl": { "size": 56, "lineHeight": 64, "weight": 700, "tracking": -0.02, "use": "marketing heroes" },
      "display":    { "size": 36, "lineHeight": 44, "weight": 700, "tracking": -0.02, "use": "page heroes, big stats" },
      "h1":         { "size": 28, "lineHeight": 36, "weight": 600, "tracking": -0.01, "use": "screen titles" },
      "h2":         { "size": 22, "lineHeight": 30, "weight": 600, "tracking": -0.01, "use": "section titles" },
      "h3":         { "size": 17, "lineHeight": 24, "weight": 600, "tracking": 0,     "use": "card titles" },
      "body-lg":    { "size": 17, "lineHeight": 26, "weight": 400, "use": "member-app body" },
      "body":       { "size": 15, "lineHeight": 22, "weight": 400, "use": "default UI text" },
      "body-sm":    { "size": 13, "lineHeight": 18, "weight": 400, "use": "secondary text, table cells (compact)" },
      "caption":    { "size": 12, "lineHeight": 16, "weight": 500, "use": "labels, timestamps" },
      "overline":   { "size": 11, "lineHeight": 14, "weight": 600, "tracking": 0.06, "case": "upper", "use": "eyebrows, column headers" },
      "stat":       { "size": 32, "lineHeight": 36, "weight": 700, "family": "display", "numeric": "tabular-nums", "use": "stat tiles" },
      "mono-data":  { "size": 13, "lineHeight": 18, "weight": 400, "family": "mono", "use": "codes, IDs, splits" }
    }
  },
  "spacing": {
    "unit": 4,
    "scale": { "0": 0, "0.5": 2, "1": 4, "1.5": 6, "2": 8, "3": 12, "4": 16, "5": 20, "6": 24, "8": 32, "10": 40, "12": 48, "16": 64, "20": 80, "24": 96 }
  },
  "radius": {
    "xs": 4, "sm": 6, "md": 8, "lg": 12, "xl": 16, "2xl": 24, "full": 9999,
    "usage": { "inputs+buttons": "md", "cards": "lg", "sheets+modals": "xl", "member-app-cards": "xl", "pills+avatars": "full" }
  },
  "shadow": {
    "xs": "0 1px 2px rgba(10,10,11,0.05)",
    "sm": "0 1px 3px rgba(10,10,11,0.08), 0 1px 2px rgba(10,10,11,0.04)",
    "md": "0 4px 10px rgba(10,10,11,0.08), 0 2px 4px rgba(10,10,11,0.04)",
    "lg": "0 12px 28px rgba(10,10,11,0.12), 0 4px 8px rgba(10,10,11,0.05)",
    "xl": "0 24px 56px rgba(10,10,11,0.18)",
    "focus": "0 0 0 3px rgba(255,90,31,0.35)",
    "dark-mode-note": "dark surfaces elevate via bg lightening (track.925→900→800) + 1px border, shadows at 40% opacity"
  },
  "motion": {
    "duration": { "instant": 80, "fast": 140, "base": 200, "slow": 320, "celebrate": 600 },
    "easing": {
      "standard": "cubic-bezier(0.2, 0, 0, 1)",
      "enter": "cubic-bezier(0.1, 0.9, 0.2, 1)",
      "exit": "cubic-bezier(0.4, 0, 1, 1)",
      "spring-celebrate": "spring(mass:1, stiffness:280, damping:22)"
    },
    "rules": [
      "state changes: instant/fast; spatial changes (sheets, panels): base/slow",
      "celebrate reserved for earned moments: check-in success, PR, perk unlock, challenge finish",
      "respect prefers-reduced-motion: replace movement with opacity, kill celebrate physics"
    ]
  },
  "breakpoints": {
    "sm": 640, "md": 768, "lg": 1024, "xl": 1280, "2xl": 1536,
    "organizer": "designed at 1280–1440, functional to 768; <768 → mobile-web nav (Today + 4 surfaces + More)",
    "member": "designed at 390, scales 320–428; tablet = centered 480 column"
  }
}
```

Numbers everywhere use `tabular-nums`. Distances/pace/splits use `mono-data` when aligned in lists.

---

## 4. White-Label Theming (CRITICAL)

Clubs theme the **member app, event pages, landing pages, and club public site**. The organizer app, Brand Portal, and Vendor Portal always run the RunOS theme.

### 4.1 What a club provides (Brand Kit — Platform → White-label)

```json
{
  "brandKit": {
    "clubPrimary": "#0FA968",
    "clubOnPrimaryPreference": "auto",
    "logo": { "light": "url", "dark": "url", "mark": "url" },
    "appearanceDefault": "dark",
    "displayFontOptIn": "one of a curated, licensed, legibility-vetted list (optional)",
    "radiusPersonality": "sharp | default | soft"
  }
}
```

That's the entire override surface. Clubs never touch primitives, semantic mappings, spacing, or type scale directly.

### 4.2 Auto-generated club ramp

From `clubPrimary`, the token pipeline generates a full 50–950 ramp in OKLCH:

1. Convert `clubPrimary` to OKLCH; treat it as the ramp's ~500 anchor.
2. Generate steps by fixed lightness targets (matching the orange ramp's L values) with chroma tapered at the extremes — this guarantees each `club.N` step has the same contrast behavior as the equivalent `orange.N` step.
3. The generated ramp replaces `accent/*` semantic values only: `accent/default`, `accent/hover`, `accent/active`, `accent/subtle-bg`, `border/focus`, `text/link` (light: club.600, dark: club.400), plus chart series-1.

### 4.3 Contrast guardrails (non-negotiable, enforced at save time)

- **G1 — on-accent text:** compute contrast of white and `track.950` against `accent/default`; pick the winner ≥4.5:1. If neither passes, shift the anchor's lightness (not hue) until one does; show the club a live preview of the adjustment ("we tuned your green 4% darker so buttons stay readable").
- **G2 — link/text usage:** `text/link` uses club.600 (light) / club.400 (dark), which by ramp construction meet ≥4.5:1 on `bg/base`. Never the raw brand hex.
- **G3 — status colors are reserved:** success/warning/danger/info/ai never re-map. If `clubPrimary` collides with a status hue (ΔE < 12 vs red/amber/green), the UI keeps status semantics and warns the club in the brand-kit preview.
- **G4 — Pacer Violet is platform-owned:** AI affordances stay violet in every theme; "Powered by RunOS" placement is fixed.
- **G5 — QR surfaces:** ticket/redemption QR always renders on a guaranteed white tile with black modules regardless of theme.
- **G6 — preview gate:** brand kit cannot be published until the automated audit passes (every semantic pair ≥ WCAG AA in both appearances); failures shown as annotated screenshots, with the auto-fix offered.

### 4.4 Theming mechanics

- Web: club tokens delivered as a CSS custom-property layer scoped to the club's domain; member app: theme object resolved at club-selection, cached, applied via context — no rebuild per club (one Expo codebase).
- `radiusPersonality` maps to a ±4 pt shift on `lg/xl` radii only. `displayFontOptIn` affects `display/h1` only; body stays Inter for legibility and i18n coverage.

---

## 5. Component Inventory (core ~42)

All components: default / hover / active / focus-visible / disabled / loading states unless noted. Built once, themed via semantic tokens, shared organizer↔portals; member app has RN equivalents.

| # | Component | Variants | Key states / notes |
|---|---|---|---|
| 1 | Button | primary, secondary, ghost, danger, ai (violet) · sm/md/lg · icon-only | loading spinner replaces label, width locked; `⌘Enter` submits primary in dialogs |
| 2 | Split/dropdown button | primary+menu | menu inherits button variant |
| 3 | Text input | default, with-icon, with-addon, error, success | inline validation on blur, error text slot |
| 4 | Textarea | default, autogrow, with Pacer "✦ draft" affordance | char counter optional |
| 5 | Select | native-feel custom, searchable, multi | virtualized ≥50 options |
| 6 | Combobox / typeahead | entity picker (member, route, sponsor) | shows entity chips with avatars |
| 7 | Date & time picker | date, range, time, recurrence editor | recurrence renders plain-language summary |
| 8 | Checkbox / Radio / Switch | sm/md; switch has labeled on/off | switch = instant effect; checkbox = form-y |
| 9 | Slider | single, range | used in forecasting scenarios |
| 10 | Segmented control | 2–5 options | view toggles (table/board) |
| 11 | Chips / filter tokens | filter, entity, consent-lock (🔒) | removable, keyboard-navigable |
| 12 | Badge | status (neutral/success/warning/danger/info/ai/live) · dot, subtle, solid | live badge pulses (reduced-motion: static) |
| 13 | Tag | colored label, editable set | club-definable colors from a fixed accessible set |
| 14 | Avatar | person, club, brand · xs–xl · group/stack (+N) | fallback initials on `bg/muted` |
| 15 | Card | flat, raised, interactive, stat-tile-container | interactive card = whole-card hit area |
| 16 | Stat tile | value+delta+sparkline, value+meter, big-number | tabular-nums; delta arrows colorblind-safe (▲▼ + color) |
| 17 | Table | comfortable/compact density, sticky header, column config, row selection, inline edit | virtualized; skeleton rows; bulk-action bar |
| 18 | List / list item | 1–3 line, with meta, with actions | `j/k` navigation |
| 19 | Kanban board | pipeline (sponsors), lifecycle (members) | drag with keyboard alternative (⌘arrows) |
| 20 | Calendar | month/week/agenda, event chips, drag-reschedule | weather glyph slot |
| 21 | Timeline / activity feed | object timeline, audit log | permission-filtered entries |
| 22 | Tabs | underline (page), contained (card) | lazy-render panels |
| 23 | Breadcrumb | level-3 detail pages only | per IA depth rules |
| 24 | Nav rail / bottom tabs | organizer rail (collapsible), member 5-tab bar | badge slots |
| 25 | Scope pill / context switcher | club·chapter switcher, scope indicator | ⌘⇧O |
| 26 | Sheet (slide-over) | right (detail), bottom (mobile) · md/lg | one layer max; ESC + swipe-down close |
| 27 | Modal / dialog | confirm, form, full-screen (mobile) | destructive = danger button + typed-confirm for irreversible |
| 28 | Popover / tooltip | info tooltip, definition tooltip (metrics), menu | definition tooltips on every KPI |
| 29 | Toast | success/info/warning/danger, with undo action | 5 s; undo = the confirmation-dialog killer |
| 30 | Banner / callout | page-level info/warning/upgrade, offline banner | dismissable persistence per-user |
| 31 | Command bar (⌘K) | navigate/act/ask modes, result groups | <100 ms open; streams Pacer answers |
| 32 | Pacer panel & inline "✦" affordances | side panel, inline draft button, insight card, digest card | always violet; grounding disclosure footer |
| 33 | Empty state | momentum (primary action + Pacer assist), sample-data offer | per IA §10 philosophy |
| 34 | Skeleton loaders | text, tile, table-row, card | layout-stable, shimmer honors reduced-motion |
| 35 | Progress | bar, ring (challenge), meter (setup score), steps | ring supports live animation |
| 36 | QR code display | ticket, redemption (store mode) | white tile guaranteed (G5), brightness boost hook |
| 37 | QR scanner | full-screen scan, embedded scan card | offline queue indicator; torch toggle |
| 38 | Charts | line/area (trend+forecast band), bar (h/v, stacked), sparkline, funnel, heatmap-calendar, distribution | see §6 rules |
| 39 | Map | route card, live event map, static thumbnail | route privacy respects consent |
| 40 | Uploader | image, CSV/file, avatar crop | CSV preview + column mapping subcomponent |
| 41 | Rich text / block editor | posts, email, landing-page blocks | Pacer draft/rewrite inline |
| 42 | Wizard / stepper | onboarding, event builder steps | steps are navigable, saved per step |

Composition rules: components never hardcode colors (lint-enforced: only semantic tokens); every interactive component ships keyboard + screen-reader behavior in the same PR as visuals; Storybook story per state is the definition of done.

---

## 6. Data-Viz Rules (analytics surfaces)

1. **Series palette (in order):** 1 accent (club-themed on member surfaces, Pace Orange on RunOS surfaces), 2 Tempo Blue, 3 Split Green, 4 Pacer Violet (only if AI-derived series), 5 Amber, 6 `track.400`. Max 6 series; beyond that, group into "Other".
2. **Comparisons are mandatory.** No naked numbers: every stat carries delta vs. previous period, benchmark, or target. Deltas encode with ▲/▼ glyph + color (never color alone).
3. **Forecasts look like forecasts.** Predicted values render as hatched/translucent bands with confidence range; the historical/forecast boundary is a labeled vertical rule. Never draw a prediction in the same visual weight as a fact.
4. **Bars for composition, lines for time, never pie** (revenue mix = horizontal stacked bars). Heatmap-calendar for attendance rhythm.
5. **Axes:** start at zero for bars; lines may zoom with an explicit axis-break indicator. Gridlines `border/default` at 50% opacity; label with units, abbreviate ≥10k (12.4k).
6. **Density:** default chart height 240 px desktop / 180 px mobile; sparklines 32 px, no axes, tooltip on touch/hover.
7. **Anonymization visible:** benchmark charts always show the "clubs like yours (k≥50, anonymized)" label; suppressed cohorts render an explicit suppressed cell, never a zero.
8. **Empty/sample:** charts in sample-data mode carry a diagonal "SAMPLE" watermark at 8% opacity.
9. **Interactive everywhere:** hover/tap reveals exact values; click filters or drills; every chart exports (PNG/CSV) from its ⋯ menu.

---

## 7. Accessibility (WCAG 2.2 AA), Density, Dark Mode

**Accessibility standards**
- Contrast: text ≥4.5:1, large text ≥3:1, UI components/graphics ≥3:1 — enforced in the token pipeline (§4.3 G6) for both RunOS and club themes.
- Target size ≥24×24 CSS px (2.2 AA), member-app primary targets ≥44 pt; focus visible on every interactive element (2 px `border/focus` ring, never removed); focus not obscured by sticky bars (2.2).
- Dragging (kanban, calendar) always has a single-pointer/keyboard alternative (2.2 §2.5.7). No cognitive-function-only auth (magic link + OAuth available).
- Full keyboard map: `⌘K` command bar, `g` then letter for surfaces (`g t` Today, `g e` Events…), `j/k` list navigation, `x` select, `⌘Enter` primary submit, `?` shortcut overlay.
- Screen readers: every chart has a data-table alternative (auto-generated); live regions for check-in counts and toasts; QR flows fully operable via the human-readable code path.
- Motion: `prefers-reduced-motion` honored globally; outdoors/sunlight max-contrast mode on Live Day and ticket screens.
- Language: member app localized (i18n from day one); reading level of consent copy ≤ grade 7.

**Density modes (organizer app)**
- Comfortable (default) and Compact (−20% row heights, `body-sm` in tables, tightened spacing scale ×0.75 on tables/lists). Per-user, per-surface memory. Member app has no compact mode.

**Dark mode rules**
- Member surfaces default dark (club can flip default); organizer defaults light; both fully support the other and follow OS preference unless overridden.
- Dark mode is a semantic-token remap, never component-level overrides. Elevation = lighter surface + border, not heavier shadow. Accent shifts one ramp step lighter (500→400) for hover on dark to preserve contrast. Pure black reserved for OLED ticket screen; app base is `track.950`.
- Images/logos: club uploads light+dark logo variants; missing dark variant triggers an auto-check (logo luminance vs. `track.950`) and a containment tile fallback.
