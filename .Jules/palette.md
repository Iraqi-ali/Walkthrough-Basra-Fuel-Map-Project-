## 2024-09-02 - Added Focus-Visible and ARIA Labels
**Learning:** Found that buttons like icon-only buttons or product report buttons lacked ARIA labels, making them inaccessible to screen readers. Focus states for keyboard navigation were missing on several interactive elements (like icon buttons and filter pills).
**Action:** Add ARIA labels (like `aria-label`) to icon-only buttons, and add a `:focus-visible` utility in CSS to provide a clear focus ring without disrupting mouse users.
