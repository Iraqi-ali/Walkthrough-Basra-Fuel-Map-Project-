## 2026-08-26 - Securing SimpleHTTPRequestHandler

**Vulnerability:** The `SimpleHTTPRequestHandler` in `server.py` exposed sensitive backend files (like `server.py`, `reports.json`, `visitors.json`) and was vulnerable to directory traversal via `GET` and `HEAD` requests.
**Learning:** Overriding `do_GET` without addressing fallback logic or `do_HEAD` leaves the static file server open to metadata leakage and content exfiltration. Checking prefixes like `/api/` before blocklisting is easily bypassed using path traversal (`/api/../server.py`). The `translate_path` method must be used to resolve the path securely before evaluating it against a blocklist.
**Prevention:** Always apply robust blocklist checks to the resolved path (`translate_path`) unconditionally, and ensure both `do_GET` and `do_HEAD` are overridden to enforce these access controls.
