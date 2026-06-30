## 2024-07-01 - Missing ARIA label on search input
**Learning:** The main search input (`#stationSearch`) in this Arabic-language UI was missing an `aria-label`, leaving screen readers without context. Furthermore, a decorative search icon inside the input wrapper lacked `aria-hidden="true"`, potentially causing redundant/confusing announcements.
**Action:** Added `aria-label="ابحث باسم المحطة أو القضاء أو المنطقة"` to the search input, ensuring Arabic localization is maintained. Added `aria-hidden="true"` to the decorative icon. Ensure to check for ARIA labels on all inputs.
