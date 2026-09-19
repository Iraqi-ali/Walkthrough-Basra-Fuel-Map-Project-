## 2023-10-24 - Debouncing Frequent DOM Reflows
**Learning:** Frequent input events triggering large DOM updates (list renders and map marker updates) block the main thread and cause UI jank.
**Action:** Always wrap text input handlers that trigger re-renders in a debounce function to minimize unnecessary DOM operations during active typing.
