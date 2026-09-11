## 2026-09-11 - Path Traversal & Sensitive File Exposure
**Vulnerability:** SimpleHTTPRequestHandler exposes hidden files (.git) and sensitive server files (.py, .json) to path traversal.
**Learning:** By default, SimpleHTTPRequestHandler serves any file in the directory structure.
**Prevention:** Explicitly block access to hidden files/directories and sensitive extensions like `.py` or `.json` in overridden `do_GET` and `do_HEAD` methods using proper path sanitization unconditionally.
