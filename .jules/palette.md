## 2026-09-27 - Accessibility enhancements for FontAwesome buttons
**Learning:** Found an accessibility issue pattern where dynamic template literals in app.js and static markup in index.html used icon-only buttons without `aria-label`s, and decorative FontAwesome `<i>` tags without `aria-hidden="true"`, preventing screen readers from announcing the buttons correctly.
**Action:** When working with FontAwesome icons, always pair `aria-hidden="true"` on the `<i>` tag with an `aria-label` on the parent interactive element if there is no visible text.
