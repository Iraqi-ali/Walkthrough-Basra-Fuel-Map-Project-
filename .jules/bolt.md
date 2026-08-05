## 2026-08-05 - Vanilla JS DOM Rebuild Bottleneck
**Learning:** The application's vanilla JavaScript frontend architecture lacks a Virtual DOM and manually rebuilds the entire DOM list and Leaflet map markers from scratch on every state change (e.g., via `applyFilters()`). This causes the main thread to freeze on high-frequency events like text input.
**Action:** Always wrap functions tied to high-frequency events (like `input` or `scroll`) in a `debounce` utility to prevent UI freezing and main thread blocking, ensuring the `this` context is preserved with `apply`.
