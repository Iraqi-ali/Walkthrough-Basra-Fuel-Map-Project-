## 2024-05-24 - Debouncing Input Events
**Learning:** Synchronous DOM updates (like list rebuilding and map marker clear/add) on every keystroke cause O(n) rendering lag.
**Action:** Use a custom `debounce(func, wait)` utility to wrap frequent input event handlers like search.
