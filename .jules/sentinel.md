## 2026-08-22 - Path Traversal Vulnerability in Custom Server
**Vulnerability:** SimpleHTTPRequestHandler allowed arbitrary file read via path traversal.
**Learning:** Python's SimpleHTTPRequestHandler resolves files securely via `translate_path`. We should evaluate the output of `self.translate_path(self.path)` rather than the raw `self.path` which is trivially bypassable.
**Prevention:** Use normalized paths before applying path-based or file-based blocklists in Python servers.
