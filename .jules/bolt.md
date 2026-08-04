## 2024-08-04 - Unnecessary Map and DOM Teardowns on Keystrokes
**Learning:** The application lacks a Virtual DOM and completely tears down and recreates the Leaflet map markers and the DOM station list on every call to `applyFilters()`. Triggering this synchronously on every keystroke in the search input causes severe main thread blocking and UI freezing.
**Action:** Always wrap `applyFilters()` or similar heavy DOM/Map manipulation functions in a `debounce` utility when attaching them to high-frequency events like `input` or `scroll` in vanilla JavaScript applications.
