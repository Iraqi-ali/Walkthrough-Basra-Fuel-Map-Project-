## 2024-08-23 - Debounce Search Input
**Learning:** Search inputs triggering map/list renders on every keystroke cause significant lag, especially with large datasets like the fuel stations list.
**Action:** Debounce high-frequency events (like `input` on search fields) to prevent rapid consecutive function calls, reducing unnecessary DOM updates and improving responsiveness.