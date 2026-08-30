## 2024-05-24 - Debouncing Event Listeners
**Learning:** The station search input event listener triggers applyFilters on every keystroke. This causes performance bottlenecks and jankiness due to excessive re-rendering or processing.
**Action:** Implement a debounce utility for frequent events and wrap the specific listener instead of the core function definition.