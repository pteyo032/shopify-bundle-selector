/**
 * Editor-only warnings about bundle tier codes.
 *
 * `_bundle_tier_code` is the stable key downstream consumers (discount function,
 * reporting) match on. Liquid cannot check it from the parent block: measured
 * 2026-08-22, `block.blocks` in `buy-buttons.liquid` yields `@theme` shells with
 * no settings at all, and never enumerates the static tiers. The rendered DOM
 * does have everything — every tier exposes its code on its radio input,
 * static and dynamic alike — so the check reads that instead.
 *
 * Loaded only when `request.design_mode` is true; never shipped to customers.
 */
if (!customElements.get('bundle-tier-code-warnings')) {
  customElements.define(
    'bundle-tier-code-warnings',
    class BundleTierCodeWarnings extends HTMLElement {
      #retryFrame = 0;

      connectedCallback() {
        this.#render();

        // On some editor re-render paths this element is upgraded before its
        // sibling tiers exist. Retry once rather than silently reporting nothing.
        if (this.#tierRadios().length === 0) {
          this.#retryFrame = requestAnimationFrame(() => this.#render());
        }
      }

      disconnectedCallback() {
        if (this.#retryFrame) cancelAnimationFrame(this.#retryFrame);
      }

      /** @returns {HTMLInputElement[]} every tier radio in this selector */
      #tierRadios() {
        const root = this.closest('bundle-selector-component');
        return root ? Array.from(root.querySelectorAll('.bundle-tier__radio')) : [];
      }

      #render() {
        this.replaceChildren();

        const radios = this.#tierRadios();
        if (radios.length === 0) return;

        const untitled = this.dataset.untitledLabel || '';

        /** @type {Map<string, number>} */
        const occurrences = new Map();
        for (const radio of radios) {
          const code = (radio.dataset.tierCode || '').trim();
          if (code) occurrences.set(code, (occurrences.get(code) || 0) + 1);
        }

        for (const radio of radios) {
          if ((radio.dataset.tierCode || '').trim()) continue;
          const label = (radio.dataset.tierLabel || '').trim() || untitled;
          this.#addWarning(this.dataset.missingTemplate, '%%LABEL%%', label);
        }

        for (const [code, count] of occurrences) {
          if (count > 1) this.#addWarning(this.dataset.duplicateTemplate, '%%CODE%%', code);
        }
      }

      /**
       * @param {string | undefined} template
       * @param {string} placeholder
       * @param {string} value
       */
      #addWarning(template, placeholder, value) {
        if (!template) return;

        const warning = document.createElement('div');
        warning.className = 'bundle-selector__empty-state';
        // textContent, not innerHTML — the label and code are merchant input.
        warning.textContent = template.replace(placeholder, value);
        this.appendChild(warning);
      }
    }
  );
}
