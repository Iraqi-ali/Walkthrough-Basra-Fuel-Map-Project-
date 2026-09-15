## 2024-05-20 - Accessible Dynamic Search Results
**Learning:** Screen reader users lose context when dynamic content like search results or filtered lists update without a page reload, especially in map-heavy applications where visual feedback dominates.
**Action:** Always add `aria-live="polite"` to result count containers so that screen readers automatically announce updates when users type in the search box or click filter buttons.
