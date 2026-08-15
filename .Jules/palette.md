## 2024-05-24 - Dynamic ARIA Labels in JS Rendered Components
**Learning:** Icon-only buttons rendered dynamically via JS string literals often rely on 'title' for tooltips but lack 'aria-label' attributes, which makes them inaccessible to screen readers traversing the DOM.
**Action:** Always map 'title' properties to 'aria-label' during string template generation to ensure both visual hover tooltips and screen reader announcements remain synchronized and accessible.
