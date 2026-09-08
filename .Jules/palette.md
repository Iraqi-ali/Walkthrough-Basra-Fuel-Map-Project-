## 2024-11-20 - Global Focus Visible State
**Learning:** Found that buttons and interactive pills completely lack keyboard focus states (`:focus-visible`), meaning users navigating by keyboard won't know which element is currently selected.
**Action:** Adding a global `:focus-visible` ring across `.btn`, `.btn-icon-only`, and `.filter-pill` components using existing accent-blue variables to ensure consistent and accessible keyboard navigation next time.
