## 2024-05-18 - Heavy DOM operations in filtering
**Learning:** The application recreates all Leaflet map markers (`appState.markersGroup.clearLayers()`) and re-renders the entire stations list DOM every time `applyFilters()` is called.
**Action:** When filtering is bound to frequent events like keystrokes (`input`), always debounce the event handler rather than debouncing the core function, to prevent locking the main thread while preserving immediate feedback for click events.
