## 2026-08-12 - Prevent UI Blocking on Frequent Input Events

**Learning:** The application's vanilla JavaScript frontend architecture lacks a Virtual DOM. On every state change triggered by search or filters (`applyFilters()`), it synchronously rebuilds the entire DOM list of station cards and recreates all Leaflet map markers from scratch. This can cause severe main thread blocking and UI freezing when tied to high-frequency events like typing in the `stationSearch` input.

**Action:** Any functions tied to high-frequency events (like `input` or `scroll`) must be wrapped in a `debounce` utility to batch executions and prevent main thread blocking. When implementing the debounce utility, ensure the `this` context is preserved (e.g., using `func.apply(this, args)`) to avoid regressions in event handlers.
