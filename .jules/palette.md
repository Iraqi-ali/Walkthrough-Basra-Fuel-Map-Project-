## 2024-11-03 - Accessible Div Cards
**Learning:** When making a div (like a card) interactive using keyboard events, always check for nested interactive elements (buttons, anchors) first. Failing to return early before e.preventDefault() blocks keyboard events from reaching them.
**Action:** Add explicit event.target.closest("button, a") checks in the keydown handler for container components.