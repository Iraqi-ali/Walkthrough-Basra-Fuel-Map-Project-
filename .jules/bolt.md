## 2026-08-03 - Preserving context in debouncing
**Learning:** When creating a custom `debounce` utility in plain JavaScript, it is crucial to use `func.apply(this, args)` instead of just `func(...args)` to ensure that the `this` context is correctly preserved, especially when wrapping DOM event listeners where `this` might refer to the DOM element.
**Action:** Next time I introduce a utility like debounce or throttle, I will automatically ensure `this` is correctly propagated to prevent subtle regressions in event handlers.
