## 2024-11-05 - Debounce Search Input
**Learning:** Implementing debouncing on search inputs that trigger heavy DOM operations (like filtering lists and updating map markers) is crucial for performance, especially when there are no built in framework optimizations.
**Action:** Use a debounce function on search input event listeners to prevent unnecessary re-renders and map updates on every keystroke, specifically when dealing with vanilla JS.
