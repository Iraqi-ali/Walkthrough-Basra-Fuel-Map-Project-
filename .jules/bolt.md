## 2024-05-24 - [Frontend Performance: Debouncing Search Input]
**Learning:** Found a missing debounce on the frontend search input (`DOM.stationSearch`), which caused heavy synchronous re-renders of the DOM and Leaflet Map on every keystroke, severely blocking the main thread.
**Action:** Implemented a debounce mechanism using `setTimeout` in the input event listener to prevent continuous heavy re-renders when users type quickly in the future.
