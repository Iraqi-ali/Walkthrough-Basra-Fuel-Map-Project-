## 2024-09-13 - Missing Search Debounce Causes Excessive Repaints
**Learning:** The application updates the list and map on every keystroke during a search due to missing debouncing, triggering expensive DOM repaints and state recalculations unnecessarily.
**Action:** Implement debouncing for search inputs across similar implementations to batch UI updates and reduce layout thrashing.