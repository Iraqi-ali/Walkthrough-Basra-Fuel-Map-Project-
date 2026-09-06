## 2023-10-27 - Missing ARIA Labels on Icon-only Buttons
**Learning:** Many icon-only buttons (like directions and report buttons) lack `aria-label`s, making them invisible to screen readers, which is a common accessibility issue pattern in this app's components.
**Action:** Always ensure icon-only interactive elements have descriptive `aria-label` or `title` attributes (or ensure `title` is acting as a sufficient fallback if `aria-label` is missing, though `aria-label` is preferred for screen readers).
