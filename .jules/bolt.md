## 2026-06-24 - Vanilla JS Vanilla Event Listeners
**Learning:** `debounce` must correctly preserve the `this` context to be robust enough to use with raw JS DOM event listeners without causing subtle bugs in more complex scenarios.
**Action:** When adding `debounce` utilities to vanilla JS apps, always explicitly bind `this` using `apply` or `call`.
