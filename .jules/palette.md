## 2024-05-24 - Accessible Icon-Only Buttons and Search Inputs
**Learning:** Adding `aria-label` to parent elements (like buttons or search bars) that contain purely decorative FontAwesome `<i>` tags requires also adding `aria-hidden="true"` to the icon element to prevent screen readers from announcing redundant or confusing unicode characters.
**Action:** Always pair `aria-label` on interactive parent containers with `aria-hidden="true"` on their inner decorative icon elements.
