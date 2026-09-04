## 2026-09-04 - Missing ARIA Labels on Dynamically Rendered Buttons
**Learning:** Found that the app renders icon-only buttons via JS string literals without ARIA labels, creating a severe accessibility gap for screen reader users on key interactive elements like reporting fuel and getting directions.
**Action:** When working with dynamically rendered vanilla JS components, explicitly audit and add `aria-label` attributes to all icon-only interactive elements, mirroring their visual `title` intent.
