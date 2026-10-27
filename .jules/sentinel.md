## 2026-10-13 - Path Traversal Vulnerability in SimpleHTTPRequestHandler
**Vulnerability:** Python's SimpleHTTPRequestHandler allows fetching arbitrary files (like server.py or .git/config) if not restricted.
**Learning:** Relying on default do_GET logic exposes all files in the directory tree. Both do_GET and do_HEAD must be overridden with path validation.
**Prevention:** Implement path validation using translate_path and relpath checks, restricting access to an explicit allowlist of safe static files.
