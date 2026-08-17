## 2024-08-17 - Missing ARIA Labels on Icon-Only Buttons
**Learning:** Icon-only buttons (like report flags and Google Maps directions) lacked `aria-label` attributes, relying only on `title` which is not fully accessible to all screen readers.
**Action:** Always verify that icon-only buttons have explicit `aria-label` attributes for accessibility.
