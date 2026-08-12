## 2026-08-12 - Path Traversal via SimpleHTTPRequestHandler
**Vulnerability:** SimpleHTTPRequestHandler by default exposes all files in the execution directory (including `.py`, `.env`, `.git`, etc.).
**Learning:** Overriding `do_GET` is not enough; `do_HEAD` must also be overridden. Evaluating raw paths is vulnerable to directory traversal (`../`) and encoding tricks.
**Prevention:** Always normalize the path via `translate_path` before applying security checks, and ensure all HTTP methods (GET, HEAD, POST) are properly secured behind the blocklist.
