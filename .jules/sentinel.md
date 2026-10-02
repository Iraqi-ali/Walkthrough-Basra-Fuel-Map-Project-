## 2026-10-02 - Python SimpleHTTPRequestHandler File Exposure
**Vulnerability:** SimpleHTTPRequestHandler exposed server source code (server.py), sensitive data files (reports.json), and allowed metadata leakage via HEAD requests without validation.
**Learning:** Overriding `do_GET` alone in SimpleHTTPRequestHandler leaves `do_HEAD` exposed. Path validation must use `self.translate_path(self.path)` and check relative components to avoid parser differential bypasses.
**Prevention:** Implement comprehensive path validation for both GET and HEAD methods using translated paths, blocking hidden directories and sensitive file extensions.
