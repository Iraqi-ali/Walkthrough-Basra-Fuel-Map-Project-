## 2024-06-26 - [Search Input Debouncing]
**Learning:** Frequent DOM rebuilds and map marker recreation on every keystroke can cause significant main thread blocking, specifically because the app dynamically re-renders both the list and the map markers for all stations concurrently.
**Action:** Always debounce search inputs that trigger UI recalculations and re-renders, particularly when dealing with complex DOM elements or third-party libraries like Leaflet.
