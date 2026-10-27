## 2024-10-05 - Add Debounce to Search Input
**Learning:** Found a missing debounce implementation on the `stationSearch` input. The `input` event triggers the `applyFilters()` function, which re-renders the map markers (`renderMapMarkers`) and the DOM elements (`renderStationsList`). This could block the main thread and feel laggy with fast typing, especially since the dataset contains 142 stations with distance sorting logic.
**Action:** When implementing global text-based filters, always check if search inputs are properly debounced to avoid thrashing DOM and map render cycles.
