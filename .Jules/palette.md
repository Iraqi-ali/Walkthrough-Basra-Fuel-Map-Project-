## 2024-08-23 - Missing ARIA Labels on Icon-Only Buttons
**Learning:** Found multiple icon-only action buttons relying solely on the "title" attribute for accessibility. Screen readers may not consistently announce "title" attributes compared to explicit ARIA labels.
**Action:** Always add "aria-label" attributes to buttons containing only icons to guarantee screen reader announcements.