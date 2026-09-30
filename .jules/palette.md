## 2026-09-30 - Override Accessible Name with WCAG 2.5.3 (Label in Name)
**Learning:** Overriding an element's accessible name via `aria-label` with text completely different from its visible text violates WCAG 2.5.3 (Label in Name), as it breaks targeting for voice-control users who depend on reading what they see on screen.
**Action:** Do not apply `aria-label` to buttons that already have an established visible text label (e.g. `<span class="btn-text">`). Rely on the visible label for accessibility, or ensure the `aria-label` contains the visible text.
