## 2026-09-03 - Insecure fallback HTTP Handler Exposes Backend Code
**Vulnerability:** Path traversal and direct file exposure via `SimpleHTTPRequestHandler`'s `do_GET` fallback and completely unrestricted `do_HEAD` handling.
**Learning:** `SimpleHTTPRequestHandler` inherently serves any file in the working directory by default. Wrapping it in a custom handler but falling back to `super().do_GET()` without intercepting sensitive extensions or resolving paths allows attackers to read `.py`, `.json`, and `.git` files, bypassing custom route constraints via path traversal (e.g., `/api/../server.py`).
**Prevention:** Always unconditionally validate and sanitize the resolved path against a blocklist for both `do_GET` and `do_HEAD` before delegating to the parent handler.
