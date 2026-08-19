## 2024-03-22 - Search Input Debounce
**Learning:** Frequent events like 'input' directly trigger heavy UI and DOM operations (list filtering, map marker redrawing), creating a noticeable UI lag/bottleneck during search.
**Action:** Always wrap high-frequency search input listeners with a debounce function (e.g., 300ms) to batch operations and ensure responsiveness.