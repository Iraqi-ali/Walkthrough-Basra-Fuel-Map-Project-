## 2026-09-22 - Path Traversal & Sensitive File Exposure in SimpleHTTPRequestHandler
**Vulnerability:** Attackers can access backend source code (`server.py`) and sensitive state files (`data.json`, `reports.json`) because `SimpleHTTPRequestHandler` serves all files in the current directory.
**Learning:** Prefix-based routing (e.g., checking `/api/`) is insufficient because attackers can use traversal sequences (`/api/../server.py`), trailing slashes (`/server.py/`), or URL encoding (`/%73%65%72%76%65%72%2e%70%79`) to bypass prefix checks or naive filename matching.
**Prevention:** Always normalize the request path using `urllib.parse.unquote` and `posixpath.normpath` to extract the true filename, and unconditionally apply a blocklist for sensitive files before any other routing logic.
