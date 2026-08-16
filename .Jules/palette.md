## 2026-08-16 - Adding ARIA Labels to Icon-Only Buttons
**Learning:** Found icon-only buttons (`.btn-report-product` and `.btn-report-station`) missing ARIA labels in `app.js`, which impacts screen reader accessibility. Although they have `title` attributes, `aria-label` is preferred for explicit accessibility support.
**Action:** Always verify that buttons containing only icons have `aria-label` attributes mirroring their `title` or describing their action.
