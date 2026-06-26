## 2026-06-26 - [Source Code Disclosure]
**Vulnerability:** In `server.py`, the `do_GET` method in `http.server.SimpleHTTPRequestHandler` was using `super().do_GET()` as a fallback for unmatched paths, which allows serving any file in the current directory, including backend source code and sensitive databases.
**Learning:** Overriding Python's `SimpleHTTPRequestHandler` without an explicit allowlist pattern for static files introduces a severe risk of exposing source code and sensitive application data.
**Prevention:** Implement a strict allowlist in the `do_GET` fallback logic to only permit explicitly approved static file paths (e.g., `["/index.html", "/app.js", "/style.css"]`), and explicitly block (e.g. 403 Forbidden) all other unmatched files.
