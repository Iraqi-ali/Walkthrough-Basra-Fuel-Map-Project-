## 2026-10-07 - Debouncing Search Inputs for Map Markers
**Learning:** Frequent input events triggering computationally expensive rendering tasks (like filtering lists and re-rendering map markers with Leaflet) can significantly block the main UI thread.
**Action:** Always wrap search input handlers connected to list/map re-renders with a debounce function (e.g. 300ms) to reduce redundant function calls while user is typing.
