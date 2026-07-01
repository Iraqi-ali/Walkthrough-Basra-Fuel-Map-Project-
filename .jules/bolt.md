## 2024-07-01 - [Debounce Search Input on Vanilla JS List and Map Rendering]
**Learning:** In a vanilla JS + Leaflet application architecture where an input filter triggers rebuilding DOM lists and map markers, synchronous firing on every keystroke (`input` event) leads to severe O(n) rendering lag due to destroying/recreating many elements instantly.
**Action:** When filtering a large client-side data array that is tied to heavy DOM manipulation (like Leaflet marker rendering or long list rendering), always debounce the text input event listeners (e.g. 300ms) to unblock the main thread.
