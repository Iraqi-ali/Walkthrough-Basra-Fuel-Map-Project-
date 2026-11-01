## 2024-05-20 - Keyboard Accessibility for Custom UI Cards
**Learning:** When making complex interactive containers (like div cards) accessible via keyboard (tabindex="0", role="button"), naively preventing default behavior on keydown for Enter/Space can block users from activating nested interactive elements (like links or buttons).
**Action:** Always check if (e.target.closest("button, a")) return; in the keydown handler of parent components before calling e.preventDefault() to ensure nested interactive elements remain accessible.
