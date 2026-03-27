```markdown
# Design System Strategy: The Obsidian Standard

## 1. Overview & Creative North Star: "The Technological Monolith"
The Creative North Star for this design system is **The Technological Monolith**. Inspired by high-end automotive engineering and editorial minimalism, the aesthetic moves away from the "busy" nature of traditional car rental platforms. Instead, it treats the UI as a premium gallery where the vehicles are the art and the interface is the sophisticated frame.

To break the "template" look, we utilize **Intentional Asymmetry**. Hero images should bleed off the canvas, and typography should utilize extreme scale shifts—pairing massive `display-lg` headlines with generous `16 (5.5rem)` or `20 (7rem)` spacing units. This creates a sense of "unhurried luxury" and technical precision.

---

## 2. Colors & Surface Philosophy
The palette is rooted in high-contrast neutrals, utilizing deep blacks and slate grays to evoke the feel of carbon fiber and polished steel.

### The "No-Line" Rule
**Strict Mandate:** Designers are prohibited from using 1px solid borders to define sections. Layout boundaries must be achieved through background color shifts. Use `surface` (#f9f9ff) for the main canvas and `surface-container-low` (#f2f3fc) to define content blocks. This creates a seamless, "molded" look rather than a stitched-together grid.

### Surface Hierarchy & Nesting
Treat the UI as a physical stack of premium materials:
*   **Base Layer:** `surface` (#f9f9ff)
*   **Recessed Sections:** `surface-container-low` (#f2f3fc)
*   **Elevated Components:** `surface-container-lowest` (#ffffff)
*   **Interactive Overlays:** `primary-container` (#3e6ae1) with 85% opacity.

### The "Glass & Gradient" Rule
To avoid a flat, "budget" feel, use **Glassmorphism** for floating elements (like car spec overlays). Apply `surface-container-lowest` with a 70% opacity and a `20px` backdrop-blur. 
*   **Signature Texture:** Use a subtle linear gradient on primary CTAs: `primary` (#1c50c7) to `primary-container` (#3e6ae1) at a 135-degree angle to provide a metallic, light-catching sheen.

---

## 3. Typography: Editorial Authority
The typography system uses **Space Grotesk** for structural impact and **Inter** for technical clarity.

*   **Display Scale (`display-lg` to `display-sm`):** Reserved for vehicle names and bold brand statements. These should be set with tight letter-spacing (-0.02em) to feel like a car’s emblem.
*   **Headline & Title:** Used for technical specs and categorization. The contrast between a `display-lg` car name and a `title-sm` performance spec creates a high-end editorial hierarchy.
*   **Body & Labels:** Set in **Inter**. Use `label-md` for technical data points (e.g., "0-60 MPH") to maintain a clean, "instrument cluster" aesthetic.

---

## 4. Elevation & Depth: Tonal Layering
We do not use shadows to simulate height; we use **Tonal Layering**.

*   **The Layering Principle:** A vehicle card (`surface-container-lowest`) sitting on a `surface-container-low` section creates a natural lift. This "Paper-on-Stone" approach feels more modern than drop shadows.
*   **Ambient Shadows:** If a floating action is required (e.g., a "Book Now" sticky bar), use a tinted shadow: `0px 20px 40px rgba(25, 28, 34, 0.06)`. It must feel like ambient light, not a black glow.
*   **The "Ghost Border" Fallback:** If a container requires definition against a similar background, use `outline-variant` (#c3c6d6) at **10% opacity**. It should be felt, not seen.

---

## 5. Components

### Buttons (High-Precision Triggers)
*   **Primary:** Solid `primary` (#1c50c7) or the Signature Gradient. Roundedness: `md` (0.375rem). No border.
*   **Secondary:** `surface-container-highest` (#e1e2eb) with `on-surface` text.
*   **Tertiary:** Ghost style. No background, `primary` text, with a `0.5 (0.175rem)` bottom-accent on hover.

### Cards & Vehicle Lists
*   **Rule:** Forbid divider lines.
*   **Structure:** Use a `surface-container-low` background for the card. Use `spacing-6` (2rem) of internal padding.
*   **Imagery:** Vehicles must be high-quality PNGs with shadows baked into the image or high-contrast studio photography.

### Input Fields
*   **State:** Default state uses `surface-container-high` (#e6e8f0) as a solid background fill. 
*   **Focus:** Transition the background to `surface-container-lowest` and apply a `2px` "Ghost Border" using the `primary` color at 40% opacity.

### Car Spec Chips
*   **Style:** Small, pill-shaped (`rounded-full`) using `secondary-container` (#e1e2eb) with `on-secondary-container` (#62646c) text. Use these for "Electric," "Autopilot," or "Luxury Sedan" tags.

---

## 6. Do’s and Don'ts

### Do:
*   **Do** use extreme whitespace. If a section feels "full," add `spacing-12` (4rem) of padding.
*   **Do** use "Full" roundedness (9999px) for interactive chips and "MD" (0.375rem) for structural cards.
*   **Do** prioritize the car's silhouette. The UI should "get out of the way."

### Don't:
*   **Don't** use 100% black (#000000) for body text; use `on-surface` (#191c22) for better readability against white.
*   **Don't** use standard "Drop Shadows" from a UI kit. If it looks like a default shadow, it is wrong.
*   **Don't** use dividers or lines to separate content. If you need a break, use a `surface-container` color shift or a `spacing-8` (2.75rem) gap.
*   **Don't** use "loud" colors for success/error states. Use the defined `error` (#ba1a1a) sparingly, ensuring it fits the muted, professional palette.