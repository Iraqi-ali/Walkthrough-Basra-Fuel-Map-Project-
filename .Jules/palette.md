## 2026-06-28 - Keyboard Accessibility and ARIA Labels
**Learning:** For dynamic interactive UI elements, especially icon-only buttons (like `.btn-report-product`, `.btn-directions`) and input fields relying on placeholders, screen readers require explicit `aria-label` attributes to correctly announce their purpose. Additionally, ensuring a distinct focus state via `:focus-visible` styling is essential for keyboard navigability.
**Action:** When adding interactive elements without text, always include an `aria-label`. Ensure focusable elements possess clear visual indicators.
