## 2026-10-11 - [Path Traversal in SimpleHTTPRequestHandler]
**Vulnerability:** Path traversal and sensitive data exposure via SimpleHTTPRequestHandler's unconstrained endpoints.
**Learning:** Overriding do_GET is insufficient to protect endpoints if do_HEAD remains open, and the default handler serves all local files including sensitive source code and git histories.
**Prevention:** Implement path validation checks against both hidden directories (e.g. .git) and specific server-side files (e.g. server.py, reports.json), and enforce these checks consistently across all HTTP method overrides.
