## 2024-08-02 - Dynamic ARIA Labels in JS Templates
**Learning:** When generating interactive components (like buttons and anchors) dynamically via JavaScript template literals, static ARIA labels (e.g., "Report product") lack necessary context for screen reader users when multiple identical components exist on the page.
**Action:** Always use template variables (e.g., `${st.stationName}`, `${pName}`) within `aria-label` attributes to inject specific context, ensuring each action has a unique and descriptive accessible name.
