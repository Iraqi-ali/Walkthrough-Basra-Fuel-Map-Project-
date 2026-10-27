## 2026-10-05 - Missing ARIA Labels on Dynamically Generated Icon-Only Buttons
**Learning:** Dynamically generated icon-only action buttons (directions, reporting) in app.js station cards relied solely on title attributes, making them inaccessible to screen readers.
**Action:** Added context-aware aria-label attributes (e.g., including station name/product) to these buttons and set aria-hidden="true" on the decorative FontAwesome icons.
