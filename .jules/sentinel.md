## 2026-09-23 - Prevent Path Traversal and Sensitive File Exposure
**Vulnerability:** The local `SimpleHTTPRequestHandler` exposed backend source code (`server.py`) and sensitive JSON data files due to a lack of path validation and filtering, allowing direct access and path traversal (e.g., `/api/../server.py/`).
**Learning:** Normalizing (`posixpath.normpath`) and unquoting (`urllib.parse.unquote`) the requested path before validating the base filename is critical. Relying on path prefixes or raw paths enables traversal bypasses.
**Prevention:** Implement an unconditional explicit blocklist for sensitive server files at the very beginning of the request handler (`do_GET`), ensuring the path is fully normalized before extraction.
