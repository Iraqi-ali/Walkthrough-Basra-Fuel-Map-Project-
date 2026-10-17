## 2026-10-17 - Debounce Search Input
**Learning:** The application re-rendered the list and map markers for every single keystroke in the station search input, which caused noticeable lag when typing quickly.
**Action:** Always debounce text inputs that trigger heavy DOM updates (like list rendering and map marker updates) to prevent main thread blocking and improve responsiveness.
