## 2026-10-01 - Prevent path bypass via HEAD request metadata leakage
**Vulnerability:** Python's `SimpleHTTPRequestHandler` allows accessing file metadata via `HEAD` requests for files blocked in `do_GET`.
**Learning:** Overriding `do_GET` with path validation does not protect against `HEAD` requests. Both methods must be overridden to enforce consistent security policies.
**Prevention:** Always implement `do_HEAD` with the exact same path validation logic as `do_GET` when restricting access to files in `SimpleHTTPRequestHandler`.
