## 2026-10-24 - Securing SimpleHTTPRequestHandler

**Vulnerability:** Path traversal and sensitive file exposure in `SimpleHTTPRequestHandler`.
**Learning:** `urllib.parse.urlparse` parses `//data.json` as having an empty path, bypassing path-based string checks. `translate_path` returns the absolute path, which breaks if the repo is in a hidden folder on the host when checking for dotfiles.
**Prevention:** Use `urllib.parse.unquote(self.path).lower()` for dotfile checks and `self.translate_path(self.path).lower()` for file extension checks. Remember to delete `__pycache__` artifacts after testing Python files to prevent repository pollution.
