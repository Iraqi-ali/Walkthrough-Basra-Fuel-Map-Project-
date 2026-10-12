## 2026-10-12 - Prevent Hidden File Access Leak

**Vulnerability:** SimpleHTTPRequestHandler allowed downloading hidden files and directories (like `.git/config`) due to the lack of path blocklist validation on both `GET` and `HEAD` requests.
**Learning:** Overriding `do_GET` is not enough. The `do_HEAD` method must also be secured to prevent leaking file metadata, and path verification must ensure it checks relative path segments to avoid failing when the repo itself is inside a hidden directory.
**Prevention:** Override both `do_GET` and `do_HEAD` in `SimpleHTTPRequestHandler` with identical path validation logic to fully secure endpoints. When implementing path validation, check components of the path relative to the working directory using `os.path.relpath`.
