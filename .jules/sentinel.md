## 2026-10-05 - Restrict Access to Source Code and Internal Data
**Vulnerability:** The Python `SimpleHTTPRequestHandler` exposed source code (`server.py`) and internal data files (`reports.json`, `visitors.json`) to users without restrictions.
**Learning:** Relying on `SimpleHTTPRequestHandler` for API routing without overriding default static file serving exposes sensitive backend files by default.
**Prevention:** Implement path validation checks overriding `do_GET` and `do_HEAD`, verifying allowed paths relative to the working directory using `translate_path`.
