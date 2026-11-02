## 2026-11-02 - Path bypass via Python urlparse logic
**Vulnerability:** SimpleHTTPRequestHandler path validation bypass using // prefix causing urlparse to treat path as netloc, exposing server.py
**Learning:** When using urlparse for path extraction, a leading double slash (e.g. //server.py) makes urlparse parse the filename as the netloc, leaving the path empty. Failing to handle this allowed bypassing path filters.
**Prevention:** Must explicitly handle the case where path is empty but string starts with //, or fallback to parsing without urlparse when applying path blocklists.