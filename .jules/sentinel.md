## 2026-09-28 - Secure Path Traversal and Sensitive File Exposure
**Vulnerability:** Path traversal bypasses and exposed server scripts and local data.
**Learning:** SimpleHTTPRequestHandler's default behavior allows serving internal structure if path parsing vulnerabilities exist.
**Prevention:** Use translate_path, check all parts of the local path against starting with dot, block restricted extensions and filenames.