## 2026-09-28 - Focus Rings and ARIA Labels
**Learning:** Icon-only buttons and search inputs in vanilla HTML/JS applications often lack sufficient accessibility affordances. Purely decorative font-awesome icons require `aria-hidden="true"` to prevent screen reader confusion, and their parent elements need explicit `aria-label`s.
**Action:** When improving accessibility for icon-only interactive elements, ensure the parent has an `aria-label`, the decorative child has `aria-hidden="true"`, and explicit `:focus-visible` styles are provided for clear keyboard navigation.
