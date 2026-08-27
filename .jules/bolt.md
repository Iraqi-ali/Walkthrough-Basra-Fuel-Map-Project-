## 2024-05-24 - Map Re-render Bottleneck
**Learning:** In this application, filtering the station list (`applyFilters`) also forces a complete re-render of all Leaflet map markers (`renderMapMarkers`). This makes frequent events like typing in the search input extremely expensive and can block the main thread.
**Action:** When applying debounce optimizations to shared functions, wrap the specific high-frequency event listener (e.g., `input`) rather than the core function definition, to preserve immediate execution for other triggers (e.g., `click` events).
