## 2026-10-10 - Screen Reader Accessibility for Action Buttons
**Learning:** Found icon-only interactive elements (Directions link, Report button) inside the station cards lacking explicit `aria-label`s, breaking screen reader context for these actions.
**Action:** Always verify that every icon-only button/link has an explicit `aria-label` and `aria-hidden="true"` on the icon itself to ensure screen reader users have proper context.
