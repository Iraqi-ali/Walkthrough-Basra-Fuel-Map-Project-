## 2026-09-22 - Debounce Search Input
**Learning:** Attaching heavy filter/render operations directly to 'input' events without debouncing causes severe main thread blocking during rapid typing, especially when interacting with complex DOM updates (Leaflet map markers and list rendering).
**Action:** Always wrap search input handlers that trigger re-renders or expensive calculations with a debounce function, ensuring `func.apply(this, args)` is used to preserve context.
