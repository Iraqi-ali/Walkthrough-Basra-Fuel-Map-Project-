## 2024-11-04 - Synchronous UI Updates on Input
**Learning:** The application executed the applyFilters function synchronously on every input event for the station search.
**Action:** Always debounce UI inputs that trigger frequent calculations, preserving the execution context with func.apply(this, args) for event listeners.
