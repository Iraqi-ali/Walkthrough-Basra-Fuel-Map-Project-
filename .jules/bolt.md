## 2026-10-11 - Search Input Debounce
**Learning:** Found a missing debounce on the search input listener which was firing on every keystroke, leading to unnecessary re-calculations, DOM re-renders, and map marker updates during search filtering.
**Action:** When adding search filters to inputs, remember to implement debouncing to prevent excessive function calls on high-frequency events.
