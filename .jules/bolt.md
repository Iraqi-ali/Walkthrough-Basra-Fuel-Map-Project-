## 2024-05-14 - Search Input Debouncing
**Learning:** Missing debouncing on search inputs causing excessive filtering/re-rendering on every keystroke.
**Action:** Implement a generic `debounce` function and apply it to high-frequency event listeners like search inputs.
