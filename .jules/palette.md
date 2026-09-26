## 2026-09-26 - Add ARIA labels and hide decorative icons
**Learning:** When improving accessibility by adding `aria-label`s to parent elements (like buttons or search bars) that contain purely decorative icons (e.g., FontAwesome `<i>` tags), you must also add `aria-hidden="true"` to the icon element to prevent screen readers from announcing redundant or confusing unicode characters.
**Action:** Always pair `aria-label` on the interactive parent with `aria-hidden="true"` on its decorative child icon.
