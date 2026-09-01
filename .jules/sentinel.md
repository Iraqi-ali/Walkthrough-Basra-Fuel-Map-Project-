## 2026-09-01 - Secure Path Traversal in SimpleHTTPRequestHandler
**Vulnerability:** SimpleHTTPRequestHandler allowed downloading backend source code (`server.py`) and runtime data files (`reports.json`) because it didn't restrict file access properly.
**Learning:** Checking `self.path` directly is bypassable via path traversal (`../`). To secure `SimpleHTTPRequestHandler`, `self.translate_path()` must be used to resolve the path, and both `do_GET` and `do_HEAD` must be overridden.
**Prevention:** Always normalize the path before applying blocklists or access controls in Python HTTP handlers, and consider both GET and HEAD methods.
