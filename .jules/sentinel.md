## 2026-09-02 - Path Traversal in SimpleHTTPRequestHandler
**Vulnerability:** SimpleHTTPRequestHandler allowed accessing backend Python files and database json files through directory traversal (`../`) and raw GET/HEAD requests.
**Learning:** Checking the raw URI path (like `self.path`) is insufficient for blocklists, as path traversal can bypass it. `do_HEAD` must also be protected as it could leak metadata.
**Prevention:** Always normalize paths using `translate_path` before applying security checks, evaluate the resolved basename, and override both `do_GET` and `do_HEAD`.