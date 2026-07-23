# Integration guide

This feature ships two ways to use it. Pick one.

## Option A — Standalone block (fastest to try)

Drop `blocks/bundle-selector.liquid`, `blocks/bundle-tier.liquid`,
`snippets/bundle-selector-styles.liquid`, `assets/bundle-selector.js` and the
locale keys into your theme, then add the **Bundle selector** block to your
product template from the theme editor, alongside (or instead of) the native
buy-buttons block. Add one or more **Bundle tier** child blocks under it.

## Option B — Merge into the native "Buy buttons" block (recommended)

This is how the feature is meant to be used in production: a single checkbox
on the theme's own buy-buttons block toggles between the native quantity/
add-to-cart UI and the tier selector, so a merchant can turn it on or off per
product without adding/removing blocks.

1. Copy `blocks/bundle-tier.liquid`, `snippets/bundle-selector-styles.liquid`
   and `assets/bundle-selector.js` into your theme as-is.
2. Open your theme's `blocks/buy-buttons.liquid` (Horizon or a Horizon-based
   theme). At the very top of the schema `"settings"` array, add:

   ```json
   {
     "type": "header",
     "content": "t:content.bundle_selector"
   },
   {
     "type": "checkbox",
     "id": "enable_bundle_selector",
     "label": "t:settings.enable_bundle_selector",
     "default": false,
     "info": "t:info.enable_bundle_selector"
   }
   ```

   followed by the appearance settings you want to expose (heading, colors,
   `savings_display_format`, etc. — see `blocks/bundle-selector.liquid`'s
   schema for the full list), each with:

   ```json
   "visible_if": "{{ block.settings.enable_bundle_selector }}"
   ```

3. Add the tier child block type to the schema's `"blocks"` array:

   ```json
   { "type": "bundle-tier" }
   ```

4. In the block's markup (not the schema), wrap the whole thing:

   ```liquid
   {% if block_settings.enable_bundle_selector %}
     {% render 'bundle-selector-styles' %}
     <bundle-selector-component ...>
       ...tier list + add-to-cart button, adapted from bundle-selector.liquid...
     </bundle-selector-component>
     <script src="{{ 'bundle-selector.js' | asset_url }}" type="module"></script>
   {% endif %}

   {% unless block_settings.enable_bundle_selector %}
     ...the theme's original buy-buttons markup, completely untouched...
   {% endunless %}
   ```

   The bundle markup itself is the same as in `blocks/bundle-selector.liquid`
   — just paste it inside the `{% if %}` branch instead of rendering it via a
   shared block. See **Gotcha 1** in `docs/gotchas.md` for why this can't be
   extracted into a shared snippet.

5. Copy the locale keys from `locales/*.json` and `locales/*.schema.json`
   into your theme's own locale files.

That's it — no JavaScript changes needed beyond copying `bundle-selector.js`
as-is; it only activates inside a `<bundle-selector-component>` element.
