## 2026-09-24 - Debouncing Search Input
**Learning:** Frequent events like 'input' typing can trigger expensive re-renders and filtering algorithms on each keystroke, blocking the main UI thread. In this codebase, the station search input triggered applyFilters (which in turn filters, optionally sorts by distance via trig calculations, and fully re-renders DOM list and map markers) for every keystroke.
**Action:** Always implement a debounce utility for search inputs that run expensive filter/sort/render operations to batch keystrokes and reduce CPU/render load.
