## 2024-06-29 - Source Code Disclosure Fix
**Vulnerability:** The `server.py` `do_GET` handler was configured to serve all static files implicitly by deferring to `super().do_GET()` for paths that didn't match `/` or `/api/*`. This allowed an attacker to request any file in the application directory, leading to source code disclosure (e.g., retrieving `server.py` or `.env` files).
**Learning:** `SimpleHTTPRequestHandler` serves all files in the directory by default. When using it to serve an application, explicitly block all non-required file paths.
**Prevention:** Implement an explicit allowlist in the request handler to only permit access to specific static files (like `/index.html`, `/app.js`, `/style.css`, and `/favicon.ico`), returning a `403 Forbidden` for all other requests.

## 2024-06-29 - Path Traversal URL Encoding Bypass
**Vulnerability:** A simplistic check blocking `/../` sequences in the HTTP request path can be easily bypassed by using URL encoding, such as `/api/%2e%2e/server.py`.
**Learning:** `SimpleHTTPRequestHandler` decodes URL-encoded characters. Because the block happened *before* decoding, `%2e%2e` slipped through and was later decoded into `..`, allowing full source code disclosure.
**Prevention:** Always use `urllib.parse.unquote(self.path)` before evaluating the path for path traversal sequences (`/../`) to catch any URL encoded variants.
