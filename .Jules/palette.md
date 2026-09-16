## 2026-09-16 - Adding ARIA labels to icon-only buttons
**Learning:** Icon-only buttons and search inputs were relying on 'title' attributes or placeholders, making them inaccessible to screen readers in Arabic. Adding 'aria-label' drastically improves usability for users with visual impairments without affecting the visual layout.
**Action:** Always ensure that icon-only interactive elements and inputs have explicit 'aria-label' attributes, even if they have placeholders or title tooltips.
