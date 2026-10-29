## 2026-10-29 - [Fix path traversal in backend server]
**Vulnerability:** Unauthenticated users could download backend code (server.py), internal database files, and hidden directories like .git/config because SimpleHTTPRequestHandler serves files directly by default without path restriction.
**Learning:** Subclassing SimpleHTTPRequestHandler requires explicitly checking the requested paths for sensitive files, and URL encoding (e.g. `%2e` for `.`) and query parameters must be stripped before validating paths.
**Prevention:** Always sanitize requested paths via `urllib.parse.unquote(path).split("?")[0]` and enforce an allowlist or strict blocklist to avoid accidental directory exposure.
