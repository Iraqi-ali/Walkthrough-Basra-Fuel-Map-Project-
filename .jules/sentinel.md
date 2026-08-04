## 2026-08-04 - Explicit Blocklists for Static Servers
**Vulnerability:** Path traversal and information disclosure (serving source code and sensitive state files via default simple HTTP handler).
**Learning:** Using an allowlist in Cloudflare Pages/Workers environments breaks dynamically added assets (like `data.json` statically served). We must rely on an explicit blocklist instead.
**Prevention:** Explicitly deny access to backend files (e.g., `.py`, `.md`), sensitive state files (`reports.json`, `visitors.json`), and hidden directories in `do_GET` and `do_HEAD`, using rigorous path normalization.
