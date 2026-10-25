## 2023-10-25 - Search Input Debounce
**Learning:** Frequent events like `input` on search fields can cause unnecessary UI re-renders and computation (like map distance calculation and sorting) on every keystroke if left unbound.
**Action:** Always debounce search inputs to improve performance, especially when they trigger filtering over large datasets.
