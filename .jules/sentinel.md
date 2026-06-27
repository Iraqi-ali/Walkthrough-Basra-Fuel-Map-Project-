
## 2026-06-27 - Server Path Traversal/Source Code Exposure
**Vulnerability:** The python HTTP server uses `SimpleHTTPRequestHandler` with a catch-all `else: return super().do_GET()` for paths not explicitly handled. This allows anyone to download arbitrary files from the server's directory, including `server.py` and potentially sensitive data like `data.json`.
**Learning:** Overriding `do_GET` without a strict whitelist of allowed static files in a custom python server built on `SimpleHTTPRequestHandler` exposes the entire directory to the web.
**Prevention:** Implement a strict whitelist of allowed file paths (`['/index.html', '/app.js', '/style.css', '/favicon.ico']`) for static assets, and return a 403 Forbidden for any unhandled paths instead of falling back to `super().do_GET()`. Crucially, `/` must still be allowed or handled correctly.
