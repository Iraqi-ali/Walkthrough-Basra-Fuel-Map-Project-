## 2024-05-18 - Debounce Search Input
**Learning:** The application executes `applyFilters()` synchronously on every search keystroke, which recalculates distances, sorts the list, recreates all DOM list cards, and clears/redraws all Leaflet map markers. This is a significant bottleneck causing input lag.
**Action:** Always add a debounce (e.g., 300ms) to search inputs, especially when filtering triggers heavy DOM and map re-rendering.
