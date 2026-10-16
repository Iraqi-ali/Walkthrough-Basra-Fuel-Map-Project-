## 2026-10-16 - Prevent Source Code and Data Exposure
**Vulnerability:** Python's SimpleHTTPRequestHandler served arbitrary files (e.g., server.py, reports.json, data.json) allowing source code and sensitive data exposure.
**Learning:** Overriding do_GET with a fallback super().do_GET() without path restriction or allowlists exposes the entire working directory.
**Prevention:** Implement strict file-specific allowlists (index.html, app.js, style.css) and verify paths using os.path.abspath(self.translate_path(path)) against the base directory to prevent path traversal bypasses.
