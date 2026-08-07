## 2026-08-07 - Python SimpleHTTPRequestHandler Path Traversal and Sensitive File Exposure
**Vulnerability:** SimpleHTTPRequestHandler by default allows downloading arbitrary files in the server root, exposing sensitive source code (.py, .md) and database files (reports.json, visitors.json) and allows path traversal.
**Learning:** `SimpleHTTPRequestHandler` serves all files unconditionally. For applications implementing APIs alongside static files, a robust path parser handling URL decoding, prefix blocking, traversal normalization and prefix checking is essential.
**Prevention:** Implement comprehensive blocklists inside `do_GET` and `do_HEAD` on normalized paths using posixpath to deny access to sensitive internal files when serving static frontend code.
