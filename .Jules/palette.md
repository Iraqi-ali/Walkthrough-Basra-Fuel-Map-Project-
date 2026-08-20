## 2024-05-18 - Missing ARIA Labels on Icon-only Buttons
**Learning:** Found multiple instances of icon-only buttons (like report product/station and directions) lacking proper `aria-label`s. This makes them inaccessible to screen readers, though they have `title` attributes.
**Action:** Always add `aria-label` to icon-only buttons for screen reader support.
## 2024-05-18 - Missing Focus Styles on Interactive Elements
**Learning:** Verified that buttons like `.btn`, `.btn-icon-only`, `.btn-report-product`, etc., do not have proper `:focus-visible` styles. While standard focus styles might exist in browsers, explicit `:focus-visible` styles using theme colors significantly improve keyboard accessibility and navigation experience.
**Action:** Adding `:focus-visible` rule to standard interactive elements (buttons, links) to provide a clear, visible focus ring without penalizing mouse users.
