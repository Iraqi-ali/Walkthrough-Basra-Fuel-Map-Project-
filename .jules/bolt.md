## 2024-09-11 - Debounce Search Input
**Learning:** In a single-page map application, binding a raw `input` event to a heavy filtering function (which re-calculates distances, sorts arrays, and re-renders lists/markers) causes significant main thread blocking and jank during rapid typing.
**Action:** Always wrap high-frequency event listeners (like `input` or `scroll`) in a debounce function when they trigger expensive operations to maintain a smooth UI.
