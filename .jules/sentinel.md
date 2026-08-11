## 2024-10-24 - Explicit Blocklist using Normalized Paths
**Vulnerability:** The SimpleHTTPRequestHandler fallback blindly served files, exposing backend source code (.py) and sensitive data (reports.json, visitors.json) because it evaluated the raw URI without path normalization, making it vulnerable to directory traversal and URL encoding bypasses.
**Learning:** Using an explicit blocklist (deny-list) for static file serving must always rely on the normalized, fully resolved OS path (via self.translate_path()) rather than the raw request URI to prevent trivial bypasses.
**Prevention:** Always normalize the path before applying security checks, and evaluate the resolved file path (e.g., using os.path.basename and os.sep) to safely enforce access controls when serving static files.
