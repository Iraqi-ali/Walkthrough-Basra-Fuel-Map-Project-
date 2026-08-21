## 2026-08-21 - Fix path traversal and file disclosure in SimpleHTTPRequestHandler
**Vulnerability:** SimpleHTTPRequestHandler by default allows downloading the source code, data, and arbitrary files when serving static assets, leading to data leaks.
**Learning:** Overriding do_GET is not enough, do_HEAD must also be protected, and path checking must use translate_path() and basename to prevent directory traversal and encoding evasion.
**Prevention:** Always implement an explicit denylist (or allowlist) using os.path.basename(self.translate_path(self.path)) when subclassing SimpleHTTPRequestHandler.
