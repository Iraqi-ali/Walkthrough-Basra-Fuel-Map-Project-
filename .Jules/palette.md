## 2026-07-03 - [A11y: Contextual ARIA labels]
**Learning:** Icon-only buttons used dynamically inside javascript templates (like the station cards) need dynamic variables passed to their `aria-label` to provide accurate context (e.g. `aria-label="الإبلاغ عن توفر ${pName}"`). Avoid hardcoding generic labels when dealing with dynamic list items.
**Action:** When adding ARIA labels to dynamically rendered components in JS, utilize template literals to ensure the screen reader receives contextual information tied to the specific item being iterated over.
## 2026-07-03 - [A11y: Avoid committing local artifacts]
**Learning:** Cloudflare Pages/Workers CI builds (e.g., 'basrafuelmap', 'iraqione') will fail if temporary local artifacts, cache files (`__pycache__`), or tracking directories (e.g., `.Jules/`) are accidentally committed without a `.gitignore`.
**Action:** Always ensure a properly configured `.gitignore` is present before committing, especially when using test suites, scripts, or when generating local caches.
