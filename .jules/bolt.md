## 2024-06-27 - [Debounce Search Input]
**Learning:** Frequent DOM re-renders and map marker updates in `app.js` can block the main thread.
**Action:** Always add debouncing to search inputs that trigger heavy rendering tasks, like updating map markers and large lists of DOM elements.
