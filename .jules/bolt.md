## 2024-11-11 - Synchronous applyFilters Execution
**Learning:** The architecture calls applyFilters on every keystroke synchronously.
**Action:** Always implement debouncing for input events that trigger expensive filtering.