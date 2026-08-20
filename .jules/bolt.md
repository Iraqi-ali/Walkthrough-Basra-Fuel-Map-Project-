## 2024-08-20 - Debounce Search Input
**Learning:** High-frequency event listeners like `input` without a debounce trigger expensive updates and recalculations, negatively impacting performance and user experience.
**Action:** Implemented a reusable `debounce` function and applied it to the `input` event listener for search, ensuring that updates only occur after a brief pause in typing.
