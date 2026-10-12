## 2026-10-12 - Debounce search input to limit execution rate
**Learning:** Running filter functions on every keystroke in search inputs executes the callback unnecessarily often before the user finishes typing.
**Action:** Always wrap search input handlers with a debounce function (e.g., 300ms) to limit the execution rate of the callback.
