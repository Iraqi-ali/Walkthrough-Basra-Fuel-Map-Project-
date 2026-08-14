## 2026-08-14 - Vanilla JS Re-render Thrashing
**Learning:** The application lacks a Virtual DOM and manually rebuilds all map markers and list items from scratch on every state change. High-frequency events like search input `keyup`/`input` cause severe main thread blocking.
**Action:** Always wrap high-frequency DOM event handlers (like search inputs) in a `debounce` utility in vanilla JS architectures to prevent UI freezing. Ensure `debounce` preserves `this` context for event listeners.
