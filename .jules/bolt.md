## 2024-05-23 - DOM thrashing on input
**Learning:** Search filtering on every keystroke that clears and recreates DOM nodes (`innerHTML = ''` followed by `appendChild`) and map markers (`clearLayers()` + `addLayer()`) causes significant main-thread blocking.
**Action:** When applying debounce optimizations to shared functions, wrap the specific high-frequency event listener (e.g., `input`) rather than the core function definition, to preserve immediate execution for other triggers (e.g., `click` events).
