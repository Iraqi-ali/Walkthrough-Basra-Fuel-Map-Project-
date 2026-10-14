## 2026-10-14 - Path Traversal & Source Code Disclosure
**Vulnerability:** SimpleHTTPRequestHandler allowed accessing arbitrary files (like server.py and .git/config) via path traversal and unhandled HEAD/GET requests.
**Learning:** Overriding do_GET for API endpoints is insufficient if do_HEAD remains open, and default static file serving exposes the entire working directory if not restricted.
**Prevention:** Always implement an explicit allowed list of files for static serving and validate both GET and HEAD methods with `self.translate_path` followed by strict absolute path boundaries.
