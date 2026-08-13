## 2024-05-18 - Vanilla DOM & High Frequency Events
**Learning:** The application's vanilla JavaScript frontend architecture manually rebuilds the entire DOM list and Leaflet map markers from scratch on every state change (e.g., via `applyFilters()`). Binding this directly to an `input` event without mitigation causes severe main thread blocking.
**Action:** Any functions tied to high-frequency events (like `input`) in this architecture must be wrapped in a `debounce` utility to prevent UI freezing.
