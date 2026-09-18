## 2024-05-18 - Missing ARIA Labels on Icon-only Buttons
**Learning:** Icon-only elements (like FontAwesome-based buttons) used across the app lacked ARIA labels and allowed screen readers to read unicode icons, creating poor accessibility for non-visual users.
**Action:** Always add `aria-label`s to parent buttons/inputs when they contain purely decorative icons, and explicitly add `aria-hidden="true"` to the icon element itself.
