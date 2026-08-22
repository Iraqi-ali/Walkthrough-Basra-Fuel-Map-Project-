## 2024-05-18 - Debouncing Shared Functions
**Learning:** When applying debounce optimizations to shared functions, wrap the specific high-frequency event listener (e.g., input) rather than the core function definition to preserve immediate execution for other triggers (e.g., click events).
**Action:** Always wrap the event listener callback for debouncing rather than the function definition when the function is shared across multiple event types.
