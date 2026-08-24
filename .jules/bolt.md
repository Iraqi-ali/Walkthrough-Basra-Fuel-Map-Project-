## 2024-05-24 - Debouncing Search Input
**Learning:** In a vanilla JS app updating both DOM lists and map markers, firing full re-renders on every keystroke causes noticeable main-thread jank.
**Action:** Always wrap high-frequency DOM event listeners (like search inputs) in a debounce function to batch expensive UI updates.