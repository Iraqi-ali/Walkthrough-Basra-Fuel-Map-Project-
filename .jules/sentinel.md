## 2026-08-13 - [Sensitive File Disclosure in Python SimpleHTTPRequestHandler]
**Vulnerability:** Python's SimpleHTTPRequestHandler served sensitive files like server.py (source code), .env, and json data files to the public by default.
**Learning:** SimpleHTTPRequestHandler lacks built-in security features to restrict access. Path traversal using `../` combined with URL encoding can bypass simple string-matching blocklists.
**Prevention:** Implement a robust blocklist that normalizes the requested path using `self.translate_path()`, checks file extensions, and explicitly blocks directories (e.g., .git, __pycache__) and sensitive files before serving them in both `do_GET` and `do_HEAD` methods.
