## 2024-08-17 - SimpleHTTPRequestHandler Path Traversal
**Vulnerability:** The application's `SimpleHTTPRequestHandler` exposed backend source, sensitive data (`reports.json`, `visitors.json`), and the `.git` directory via unauthenticated HTTP GET requests and path traversal.
**Learning:** `SimpleHTTPRequestHandler`'s default `do_GET` and `do_HEAD` methods serve any file from the current directory if it is not explicitly blocked, and raw paths like `/../` can bypass naive path checks unless resolved first with `translate_path`.
**Prevention:** Implement an explicit blocklist within an overridden handler, normalize and resolve the path with `translate_path` first, and check against restricted directories and file extensions. Include both `do_GET` and `do_HEAD` in the restriction.
