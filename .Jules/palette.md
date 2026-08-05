## 2024-05-24 - Dynamic ARIA labels for Icon-Only Buttons
**Learning:** In dynamically generated UI cards (like station listings), relying solely on standard `title` attributes for icon-only buttons isn't enough. Screen readers need contextual `aria-label`s that include dynamic template variables (like station or product names) to make sense of repeated actions.
**Action:** Always inject specific context (e.g., `aria-label="Report ${productName} at ${stationName}"`) into icon-only buttons generated via JavaScript to ensure unambiguous accessibility.
