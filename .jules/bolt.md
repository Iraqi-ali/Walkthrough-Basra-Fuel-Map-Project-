## 2026-10-31 - Debounce search inputs to prevent layout thrashing
**Learning:** Found that tying heavy DOM updates (like list and map rerenders) directly to `input` events on search bars causes extreme lag, particularly when many elements are involved.
**Action:** Always wrap `input` event listeners for search with a `debounce` function (e.g., 300ms) to ensure updates only fire after typing pauses.
