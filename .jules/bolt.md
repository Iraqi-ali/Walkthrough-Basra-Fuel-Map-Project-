## 2023-11-03 - Debounce search input
**Learning:** The application was rerendering and rebuilding map markers on every single keystroke.
**Action:** Implemented a debounce function for the search input to delay filter computations until 300ms after the user stops typing.
