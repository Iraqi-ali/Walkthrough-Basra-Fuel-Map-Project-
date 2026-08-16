## 2024-08-16 - Debounce High-Frequency Events in Vanilla JS Apps
**Learning:** This application lacks a Virtual DOM and completely rebuilds the list and Leaflet map markers on every state change (e.g., inside `applyFilters()`). Firing this on every keystroke (`input` event) blocks the main thread, causing severe UI freezing.
**Action:** Always wrap high-frequency event handlers (like search inputs) in a `debounce` utility, ensuring to preserve the `this` context with `apply`, to prevent unnecessary full-DOM rebuilds and maintain responsive UI performance.
