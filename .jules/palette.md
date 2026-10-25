## 2024-05-19 - Keyboard Accessibility and ARIA Labels
**Learning:** The application lacked keyboard focus indicators and ARIA labels for icon-only buttons, reducing accessibility for screen readers and keyboard users.
**Action:** Add `:focus-visible` styling to all interactive elements and explicitly label icon-only buttons and search inputs with `aria-label` attributes.