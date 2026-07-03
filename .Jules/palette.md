## 2026-07-03 - [A11y: Contextual ARIA labels]
**Learning:** Icon-only buttons used dynamically inside javascript templates (like the station cards) need dynamic variables passed to their `aria-label` to provide accurate context (e.g. `aria-label="الإبلاغ عن توفر ${pName}"`). Avoid hardcoding generic labels when dealing with dynamic list items.
**Action:** When adding ARIA labels to dynamically rendered components in JS, utilize template literals to ensure the screen reader receives contextual information tied to the specific item being iterated over.
