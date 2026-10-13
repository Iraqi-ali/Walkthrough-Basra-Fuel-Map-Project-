## 2024-10-13 - Debounce Search Input
**Learning:** Found an un-debounced search input event listener (`DOM.stationSearch.addEventListener('input', applyFilters)`) in a codebase where `applyFilters` triggers heavy operations, including re-rendering a Leaflet map with many markers and rebuilding the UI list (`renderMapMarkers` and `renderStationsList`). This causes severe main thread blocking and lag on every keystroke.
**Action:** Always check for debouncing when event listeners are tied to DOM re-renders and map redraws. Implement a simple debounce utility and wrap the expensive function.
