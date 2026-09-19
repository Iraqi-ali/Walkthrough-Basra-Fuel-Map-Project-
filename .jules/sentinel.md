## 2024-05-14 - Path Traversal Vulnerability in SimpleHTTPRequestHandler
**Vulnerability:** SimpleHTTPRequestHandler by default allows downloading arbitrary files in the web root, including the source code `server.py` and sensitive runtime state like `reports.json`.
**Learning:** Python's built-in `SimpleHTTPRequestHandler` serves any file in the current directory unless explicitly blocked or routed elsewhere.
**Prevention:** Implement explicit path validation in `do_GET` (and `do_HEAD` if used) to block requests for sensitive files like the script itself, config files, or raw database/state files.
