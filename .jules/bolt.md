## 2023-10-24 - Debounce DOM Search
**Learning:** The application updates the DOM (redrawing lists and map markers) on every keystroke when searching, which can cause significant jank and layout thrashing as the input grows or during rapid typing.
**Action:** Always implement debouncing on text input fields that trigger expensive UI or state updates, particularly filtering large datasets and rendering complex elements like maps.
