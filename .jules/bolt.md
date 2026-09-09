## 2024-10-25 - Debouncing Map Marker Re-renders
**Learning:** In Leaflet-based map applications where search input instantly triggers layer clears (`appState.markersGroup.clearLayers()`) and marker recreations, applying debounce directly to the input listener rather than the shared filter function preserves responsiveness for non-text UI controls (like product filter tabs) while saving significant DOM/map redraw costs.
**Action:** Always wrap the high-frequency event listener (e.g., `input` for text) rather than modifying the core shared function.
