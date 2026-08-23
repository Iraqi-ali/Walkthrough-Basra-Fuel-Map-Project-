## 2026-08-23 - Prevent Exfiltration of Sensitive Server Data
**Vulnerability:** The Python backend server (`server.py`) served backend files because `SimpleHTTPRequestHandler`'s `do_GET` inherited the default behavior, allowing unauthorized access to files like `server.py`, `reports.json`, `visitors.json`, and `.git/`. It also lacked handling for `do_HEAD`.
**Learning:** Always implement strict path resolution and blocklists on `SimpleHTTPRequestHandler` to explicitly deny access to backend files, secrets, and repository configuration, and ensure both `do_GET` and `do_HEAD` are overridden.
**Prevention:** Utilize `self.translate_path(self.path)` to accurately identify the resolved system path and validate it against a blocklist before returning it.
