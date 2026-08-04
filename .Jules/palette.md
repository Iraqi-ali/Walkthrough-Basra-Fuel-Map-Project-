## 2024-08-04 - Dynamic ARIA labels for template-generated components
**Learning:** When interactive components like buttons are generated via JavaScript templates for lists, relying only on generic titles leaves screen reader users without context about which specific item the button affects.
**Action:** Always use template literals to inject specific context (e.g., `${st.stationName}` or `${pName}`) into `aria-label` attributes to ensure they are accurately descriptive for screen readers.
