## 2026-08-29 - Secure Path Handling in SimpleHTTPRequestHandler
**Vulnerability:** Information Disclosure / Path Traversal
**Learning:** Checking `self.path` directly for restricted files in `SimpleHTTPRequestHandler` is bypassable via URL encoding (e.g., `/%72eports.json`) or path traversal (`/foo/../reports.json`).
**Prevention:** Always use `self.translate_path(self.path)` to resolve the normalized filesystem path before applying security blocklists, and check all parts of the path for blocked directories or file extensions.
