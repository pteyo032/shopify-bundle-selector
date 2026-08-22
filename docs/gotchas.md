# Technical gotchas

Things that cost real debugging time while building this — recorded so you
don't have to rediscover them.

1. **`{% content_for 'blocks' %}` only works directly inside a block file.**
   You cannot extract it into a shared snippet and call it via `{% render %}`
   — it throws `Liquid syntax error: Unknown tag 'content_for'`. This is why
   the tier-list markup is duplicated between `bundle-selector.liquid` and
   the buy-buttons integration rather than shared through one snippet.

2. **`closest` never gives a child block access to its parent block's
   settings** — only to typed resources like `product` or `collection`
   (confirmed against Shopify's own docs). Any parent → child data flow has
   to go through CSS custom properties (for styling) or a `data-*` attribute
   read by CSS (for conditional text/content) — see `#onProductSelect`-style
   patterns in `bundle-selector.js` and the `--bundle-tier-*` custom
   properties in `bundle-selector-styles.liquid`.

3. **Horizon's `base.css` paints its own dot on every `input[type="radio"]`**
   via a `:checked::after` pseudo-element sized from a global
   `--checkbox-size` variable, completely unrelated to a custom radio's own
   dimensions. If you build a custom radio, neutralize it explicitly:
   `.your-radio::after { content: none; }` — otherwise the theme's dot
   renders on top, invisible in the markup but visible on screen.

4. **`label:has(input[type="radio"])` in `base.css`** forces
   `display: inline-flex` on any `<label>` wrapping a radio, with higher
   specificity than a single class (`:has()` inherits its argument's
   specificity). A double-class selector (`.parent .child { ... }`) is
   usually enough to win without resorting to `!important`.

5. **Never assume a theme CSS variable's fallback value is its real computed
   value.** One padding variable here had a `0.5rem` fallback in the code
   but actually rendered at `1px`. Always check `getComputedStyle` before
   basing a `calc()` on it — or better, let the `calc()` reference the
   variable directly instead of reproducing a guessed value.

6. **`shopify theme dev` can die silently** after sitting idle — no crash
   message, the local preview just stops updating. If changes stop
   reflecting, check the process is still running before assuming there's a
   bug in your code.

7. **A product using a custom/alternate template does not share settings
   with the default template.** If a feature you configured on one product
   "isn't showing" on another, check which template each product is
   actually assigned first.

8. **On a GitHub-connected theme, editing live in the Shopify admin creates
   automatic `shopify[bot]` commits.** Always `git pull` before continuing
   local work if the store might have been edited from the admin in the
   meantime.

9. **`block.id` is not a stable identifier — do not persist it anywhere.**
   Shopify's own docs say it is "dynamically generated and subject to
   change… avoid relying on a literal value of this ID", and measurement
   confirms it for both kinds of block. A dynamic block renders as
   `AM3VLcjF0QUJHTkdIe__bundle_tier_Gym97G`; a *static* one as
   `AMVRZUTZvZFVwbGlzV__tier-3` — an opaque generated prefix, `__`, then the
   literal static id. Only the suffix is stable. It is fine for wiring up the
   DOM within one render (which is all this component uses it for), and wrong
   as a key you write into an order, a report, or a discount function.

10. **`block.blocks` does not give a parent block usable access to its
    children.** Measured in `buy-buttons.liquid`: it returns shells of type
    `@theme` whose `settings` are entirely empty — `label`, `unit_count` and
    every custom setting come back blank — and it never enumerates static
    blocks at all (their `block_order` is `[]`). A validation written in
    Liquid on top of it will silently report every child as misconfigured.
    If a parent needs to inspect its children, read the rendered DOM instead:
    that is why `assets/bundle-tier-code-warnings.js` exists rather than a
    Liquid loop.

11. **Read tier data from the radio input, not from the tier wrapper.**
    `data-tier-id` appears on three elements per tier, but `data-tier-label`
    and `data-tier-code` exist **only** on the `<input type="radio">`. The
    component reads `radio.dataset`, so an attribute added anywhere else
    comes back `undefined` — a failure that looks like a data problem rather
    than a placement one.

