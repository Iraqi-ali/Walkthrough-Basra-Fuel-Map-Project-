## 2024-05-30 - Missing aria-label on icon-only buttons
**Learning:** Icon-only buttons relying purely on `title` attributes (which are not consistently exposed to screen readers) lack accessible names.
**Action:** Ensure all icon-only buttons and important form controls have explicit `aria-label` attributes matching their visual intent or tooltip.