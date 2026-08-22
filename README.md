<p align="right"><a href="README.fr.md">Lire en français</a></p>

# Shopify Bundle Selector — "Buy more, save more" tier picker

A theme-native tier picker for Shopify product pages: the customer chooses
"Buy 1 / Buy 3 / Buy 5" (or any tiers you configure), each with its own
discount, and adds the whole bundle to the cart in a single click — with a
separate variant picker (color, size…) for every unit in the pack.

Built for the **Shopify Horizon** theme. No third-party app, no monthly fee,
no page weight beyond one small web component.

| Bundle Selector enabled | Native buy buttons |
|---|---|
| ![Product page with the Bundle Selector: three tiers, "Achetez 3" selected with per-unit color/size pickers](docs/screenshots/bundle-selector-active.png) | ![Same product with the theme's standard quantity and add-to-cart buttons](docs/screenshots/native-buy-buttons.png) |

## Features

- Configurable number of tiers, each with a label, optional subtitle, and
  its own discount: percentage off, fixed amount off, or N units free
- Optional corner badge per tier (e.g. "Most popular", "Best deal")
- Savings shown as `-15%` or `-$29.99` — merchant picks the format
- If the product has variants, every unit in a multi-unit tier gets its own
  dropdown — order a 3-pack in three different colors in one order
- One click adds every unit as its own cart line, tagged with a shared
  `_bundle_id` property so they can be grouped/tracked downstream
- Each tier carries a merchant-set **tier code**, written to the order as
  `_bundle_tier_code` — a stable key that survives renaming the tier and is
  identical in every language, so discount functions and reports have
  something reliable to match on. The theme editor flags blank and duplicate
  codes before they reach an order
- Fully theme-editor configurable: colors, typography, spacing — zero code
  changes needed to reskin it
- Can be merged into the theme's native "Buy buttons" block behind a single
  checkbox, so a merchant can turn it on or off per product without touching
  blocks (see `docs/integration-guide.md`)

## Repository contents

This repo contains **only the custom code for this feature** — not the full
Horizon theme, which belongs to Shopify. You drop these files into an
existing Horizon (or Horizon-based) theme.

| Path | What it is |
|---|---|
| `blocks/bundle-tier.liquid` | Child block — one per tier. Computes pricing, renders the row, per-unit variant selectors |
| `blocks/bundle-selector.liquid` | Standalone parent block — use this if you want the picker as its own block |
| `snippets/bundle-selector-styles.liquid` | All CSS |
| `assets/bundle-selector.js` | The `<bundle-selector-component>` web component — tier switching, variant resolution, add-to-cart |
| `assets/bundle-tier-code-warnings.js` | Editor-only component that flags blank or duplicated tier codes. Never loaded on the storefront |
| `snippets/bundle-tier-code-warnings.liquid` | Renders the above and passes it the translated messages |
| `locales/*.json`, `locales/*.schema.json` | English + French translations (storefront text and editor labels) |
| `docs/integration-guide.md` | How to install it standalone, or merge it into your theme's native buy-buttons block |
| `docs/gotchas.md` | Technical pitfalls discovered while building this, so you don't re-hit them |

## Quick start

1. Copy `blocks/`, `snippets/`, `assets/` and the locale keys from
   `locales/` into your theme.
2. In the theme editor, add the **Bundle selector** block to a product
   template, then add one or more **Bundle tier** blocks under it.
3. Configure each tier's label, unit count, and discount.

For the merged-into-native-buy-buttons version (recommended for production —
lets a merchant toggle it per product from one checkbox), see
`docs/integration-guide.md`.

## Known limitation: displayed price vs. cart price

The price shown in the picker is **for display only** — it is not
automatically enforced at checkout. To make the charged price match what's
shown, pick one:

1. **A matching native Shopify discount**, configured manually in
   Admin → Discounts (simplest, no code — requires keeping both in sync by
   hand)
2. **A Shopify Function** that reads the line item properties this picker
   already attaches and applies the discount automatically (clean, reliable,
   but a full app-extension build — not theme code). Match on
   `_bundle_tier_code`, not on `_bundle_tier`: the label is display text a
   merchant can rename and a translation can change, the code is not. Group
   the lines of one bundle by `_bundle_id`.

   Two rules for that function. Line item properties are writable by the
   customer through the cart API, so **never read a discount amount from
   them** — read the tier identity, then look the discount up in a source you
   control and re-check that the line quantities match the tier being
   claimed. And orders placed before you added tier codes will not have one:
   fall back to `_bundle_tier` when `_bundle_tier_code` is absent.
3. **Dedicated bundle variants/products** at a fixed price, so the picker
   adds one real "3-pack" variant instead of 3× the normal variant

Decide this with whoever owns the store *before* wiring it up — it changes
how much backend work is involved.

## License

MIT — see `LICENSE`.
