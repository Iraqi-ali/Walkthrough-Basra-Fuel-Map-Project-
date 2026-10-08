## 2026-10-08 - Fixed Path Traversal and Sensitive File Exposure
**Vulnerability:** The Python `SimpleHTTPRequestHandler` exposed the entire server directory, allowing access to source code (`server.py`), internal data stores (`reports.json`, `visitors.json`), and hidden directories (`.git/`).
**Learning:** Using `SimpleHTTPRequestHandler` without overriding request handling allows default read access to all files in the directory. Overriding `do_GET` alone is insufficient as `do_HEAD` can also leak file presence.
**Prevention:** Always implement path validation using `self.translate_path(self.path)` (to avoid parser differentials) and explicitly block access to hidden files and server-side files.
