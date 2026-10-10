## 2026-10-10 - Debounce Search Input
**Learning:** In this application's architecture, search filtering synchronously recalculates haversine distances, sorts data, completely rebuilds the DOM station list, and rebuilds all Leaflet map markers on every keystroke, which is a significant performance anti-pattern.
**Action:** Always verify if input events in this codebase trigger synchronous map re-rendering or DOM list rebuilds, and apply debouncing to prevent UI lag.
