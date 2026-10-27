## 2026-10-26 - Python SimpleHTTPRequestHandler Path Traversal
**Vulnerability:** Information disclosure/Path traversal in SimpleHTTPRequestHandler fallback.
**Learning:** By default, SimpleHTTPRequestHandler blindly serves any file from the CWD that isn't handled by specific routing rules. Relying purely on specific path matching for API routes and falling back to super().do_GET() exposes source code (e.g. server.py), configs (.git), and internal state (data.json).
**Prevention:** Always enforce a strict explicit allowlist of permitted static files before falling back to super().do_GET(), and parse the URL thoroughly (handling unquoting, queries, and fragments) before checking the allowlist.
