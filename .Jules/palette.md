## 2024-06-25 - Accessibility of icon-only buttons
**Learning:** The `title` attribute isn't universally reliable for screen readers, and icon-only buttons or links must have an `aria-label` attribute to properly describe their action to assistive technologies.
**Action:** Always add `aria-label` to icon-only buttons or links, even if a `title` or tooltip is present.
