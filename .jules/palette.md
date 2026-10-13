## 2026-10-13 - Icon-only buttons lack ARIA labels
**Learning:** Icon-only buttons used for critical actions like reporting or getting directions rely solely on tooltips (title), which are insufficient for screen readers.
**Action:** Always add explicit aria-label attributes to icon-only buttons and aria-hidden="true" to their internal icons to ensure screen readers announce their function correctly.
