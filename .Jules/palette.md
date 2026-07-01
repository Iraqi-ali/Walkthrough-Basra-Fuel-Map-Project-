## 2024-05-24 - Accessibility for Icon-only Buttons
**Learning:** Found multiple icon-only interactive elements (like the "Directions" and "Report" buttons in the station cards, and the search input) that lacked explicit `aria-label` attributes. While some had `title` attributes, `title` is not reliably read by all screen readers, particularly on mobile.
**Action:** Always pair visual icons and `title` attributes with explicit `aria-label` attributes on icon-only buttons to ensure reliable screen reader support across devices.
