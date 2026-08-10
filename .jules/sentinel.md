## 2026-08-10 - Bypassable Path Traversal in SimpleHTTPRequestHandler
**Vulnerability:** The custom HTTP server blocked sensitive files by evaluating the raw request path (`self.path`), which could be trivially bypassed using directory traversal (`/foo/../server.py`) or URL encoding (`/%72eports.json`).
**Learning:** Raw request paths from HTTP clients must never be used directly for security assertions, as they can contain encoded or relative path segments that evade string matching blocklists.
**Prevention:** Always normalize the request path to a canonical absolute filesystem path (e.g., using `self.translate_path(self.path)` in Python) before validating it against blocked paths, extensions, or filenames.
