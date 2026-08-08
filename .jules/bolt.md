## 2024-08-08 - Debounce search input
**Learning:** The vanilla JS app lacks a Virtual DOM and manually rebuilds the entire DOM list and Leaflet map markers from scratch on every state change (e.g., via `applyFilters()`). High-frequency events like `input` freeze the UI and block the main thread.
**Action:** Any functions tied to high-frequency events (like `input`) must be wrapped in a `debounce` utility to prevent UI freezing and main thread blocking.
