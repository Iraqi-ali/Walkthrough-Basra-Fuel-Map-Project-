## 2026-10-09 - Path Traversal & Data Leakage in SimpleHTTPRequestHandler
**Vulnerability:** Path traversal and data leakage (exposed server.py, .git/config, reports.json) via do_GET and do_HEAD.
**Learning:** Overriding do_GET is insufficient because do_HEAD remains open, and naive path parsing allows differential parser bypasses.
**Prevention:** Override both do_GET and do_HEAD, use self.translate_path(self.path) for safe resolution before validation, and check relative path components to prevent hidden directory bypasses.
