## 2024-05-24 - Path Traversal Vulnerability in SimpleHTTPRequestHandler

**Vulnerability:** The default `SimpleHTTPRequestHandler` in Python can serve any file in the working directory (and subdirectories), which includes sensitive backend source code (`server.py`), configuration files, and temporary data (`reports.json`, `visitors.json`). Path traversal allows attackers to access these files.
**Learning:** Relying on the default `do_GET` fallback without restricting access allows full read access to backend application files. Using raw URL prefixes (e.g., `if not self.path.startswith('/api/')`) is not sufficient due to path traversal (`/api/../server.py`).
**Prevention:** Always normalize paths using `self.translate_path(self.path)` before evaluating them against an explicit blocklist (or allowlist) to securely restrict access to sensitive backend files and directories, overriding both `do_GET` and `do_HEAD` if applicable.
