## 2024-05-24 - Debouncing heavy DOM and Leaflet Map marker re-renders

**Learning:** The application recalculates distances, rebuilds complex DOM nodes for station lists (`renderStationsList()`), and completely re-instantiates Leaflet map markers (`renderMapMarkers()`) on every single keystroke in the search bar. This synchronously blocks the main thread during typing, creating a significant performance bottleneck.
**Action:** Apply a debounce explicitly on high-frequency `input` event listeners (like search bars) rather than the core `applyFilters` function. Ensure the `this` context is preserved (e.g., using `func.apply(this, args)`) so that other immediate triggers remain snappy while reducing redundant work during typing.
