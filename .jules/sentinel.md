## 2026-11-05 - Secure SimpleHTTPRequestHandler Path Validation
**Vulnerability:** SimpleHTTPRequestHandler delegates to super().do_GET(), exposing source code and sensitive JSON data files to unauthenticated users.
**Learning:** Path traversal blocks must decode URLs with unquote, normalize with posixpath.normpath, handle double slash edge cases in urlparse, and protect both do_GET and do_HEAD.
**Prevention:** Override both do_GET and do_HEAD, properly normalize the request path before evaluating blocklists, and strictly deny access to .py and .git files in Python servers.
