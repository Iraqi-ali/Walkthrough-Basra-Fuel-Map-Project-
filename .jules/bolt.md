## 2024-03-24 - Debouncing Input Events
**Learning:** Found a missing debounce on the search input which causes unnecessary function calls for each keystroke.
**Action:** Always implement a debounce on `input` events that trigger filtering or API calls.
