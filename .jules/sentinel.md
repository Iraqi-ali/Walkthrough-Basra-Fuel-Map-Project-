## 2024-10-18 - Path Exposure in Python HTTP Server
**Vulnerability:** The application used SimpleHTTPRequestHandler to serve the web app but did not restrict access to specific files, exposing sensitive backend code and data files.
**Learning:** Default behavior of SimpleHTTPRequestHandler is to serve the entire working directory. If a web app runs its API and backend scripts from the same directory as its frontend assets, the backend assets become exposed without explicit access controls.
**Prevention:** Implement strict file path allowlists for static asset serving and explicitly verify that resolved absolute paths remain within expected bounds to prevent path traversal and direct object reference vulnerabilities.
