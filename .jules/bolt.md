## 2026-10-14 - Debounce Search Input
**Learning:** Adding debounce to search inputs that trigger heavy DOM and map re-renders (like Leaflet updates) significantly reduces unnecessary main-thread blocking during rapid typing.
**Action:** Always wrap search input event listeners that trigger complex UI updates in a debounce function.
