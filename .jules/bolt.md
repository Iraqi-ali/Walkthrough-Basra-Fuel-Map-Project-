## 2024-08-10 - Debounce search input to prevent DOM rebuilds
**Learning:** The application's vanilla JavaScript frontend architecture lacks a Virtual DOM and manually rebuilds the entire DOM list and Leaflet map markers from scratch on every state change (e.g., via `applyFilters()`). Any functions tied to high-frequency events (like `input`) must be wrapped in a `debounce` utility to prevent UI freezing and main thread blocking.
**Action:** Always implement debouncing for input fields that trigger expensive UI updates like re-rendering lists or maps.
