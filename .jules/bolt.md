## 2026-08-02 - Debouncing synchronous search inputs
**Learning:** Attaching heavy UI updates (destroying/recreating DOM elements and map markers) directly to input 'input' events causes severe jank and UI blocking during rapid typing because it executes on every single keystroke.
**Action:** Always wrap high-frequency events (like search inputs or scroll handlers) that trigger expensive operations (DOM manipulation, API calls, complex calculations) with a `debounce` function to limit execution rate.
