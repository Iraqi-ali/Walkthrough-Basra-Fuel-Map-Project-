## 2026-09-16 - Sensitive files exposure bypass

**Vulnerability:** SimpleHTTPRequestHandler exposed sensitive files and `.env`/hidden files through path traversal bypass (`//` or `/%2f`).
**Learning:** `do_GET` and `do_HEAD` lack implicit protection, and `urllib.parse.urlparse` cannot handle `//` well for path validation, allowing bypass of prefix/extension checks.
**Prevention:** Normalize the path and enforce blocklists in `_is_safe_path`, overriding both `do_HEAD` and `do_GET` to apply it unconditionally.
