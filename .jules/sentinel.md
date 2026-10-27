## 2024-10-27 - [Security] Prevent arbitrary file exposure in SimpleHTTPRequestHandler
**Vulnerability:** The server used SimpleHTTPRequestHandler default do_GET() for any unmatched paths, allowing access to source code and sensitive data (e.g., /server.py, /data.json).
**Learning:** SimpleHTTPRequestHandler serves all files in the current directory by default. When subclassing it and delegating unknown paths via super().do_GET(), you must explicitly whitelist allowed static files to prevent arbitrary file exposure.
**Prevention:** Implement an explicit allowlist for static file paths before calling super().do_GET() and return a 403 Forbidden for any other requests. Also ensure URL parsing with unquote is used for path validation.
