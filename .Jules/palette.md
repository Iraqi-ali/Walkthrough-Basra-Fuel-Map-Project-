## 2023-10-25 - Missing ARIA labels in dynamic HTML templates
**Learning:** Dynamic HTML template strings in `app.js` bypass standard accessibility linters, leading to missing ARIA labels on dynamically generated icon-only buttons.
**Action:** Always manually audit dynamically injected HTML strings for a11y attributes since automated build tools may not catch issues inside string literals.