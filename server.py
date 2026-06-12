import http.server
import socketserver
import json
import urllib.request
import urllib.error
import threading
import time
import os
from datetime import datetime

PORT = 8000
DATA_FILE = "data.json"
SOURCE_API_URL = "https://basrah.iraqstation.com/api.php"

# Thread lock for file operations
data_lock = threading.Lock()

def log(message):
    print(f"[{datetime.now().strftime('%Y-%m-%d %H:%M:%S')}] {message}")

def fetch_data_from_source():
    log(f"Fetching data from {SOURCE_API_URL}...")
    try:
        req = urllib.request.Request(
            SOURCE_API_URL, 
            headers={'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'}
        )
        with urllib.request.urlopen(req, timeout=15) as response:
            raw_content = response.read().decode('utf-8')
            parsed_data = json.loads(raw_content)
            
            # Wrap data with metadata
            stations = parsed_data.get("data", parsed_data) if isinstance(parsed_data, dict) else parsed_data
            
            output_data = {
                "last_updated": datetime.now().isoformat(),
                "stations": stations
            }
            
            with data_lock:
                with open(DATA_FILE, "w", encoding="utf-8") as f:
                    json.dump(output_data, f, ensure_ascii=False, indent=2)
            log("Data fetched and cached successfully.")
            return True
    except urllib.error.URLError as e:
        log(f"URL Error: {e.reason}")
    except json.JSONDecodeError:
        log("Error: Received invalid JSON from the API source.")
    except Exception as e:
        log(f"Unexpected error fetching data: {str(e)}")
    return False

def background_fetch_loop():
    # Initial fetch on startup
    if not os.path.exists(DATA_FILE):
        fetch_data_from_source()
    
    while True:
        # Sleep for 1 hour (3600 seconds)
        time.sleep(3600)
        fetch_data_from_source()

class FuelMapRequestHandler(http.server.SimpleHTTPRequestHandler):
    def end_headers(self):
        # Disable caching for API calls, allow it for static assets
        if self.path.startswith("/api/"):
            self.send_header('Cache-Control', 'no-store, no-cache, must-revalidate, max-age=0')
            self.send_header('Pragma', 'no-cache')
            self.send_header('Expires', '0')
        super().end_headers()

    def do_GET(self):
        if self.path == "/":
            self.path = "/index.html"
            return super().do_GET()
        
        elif self.path == "/api/stations":
            if not os.path.exists(DATA_FILE):
                # If cache file doesn't exist, try fetching it synchronously
                success = fetch_data_from_source()
                if not success:
                    self.send_response(500)
                    self.send_header("Content-Type", "application/json; charset=utf-8")
                    self.end_headers()
                    self.wfile.write(json.dumps({"error": "Unable to fetch fuel data"}).encode('utf-8'))
                    return
            
            # Read cached data
            try:
                with data_lock:
                    with open(DATA_FILE, "r", encoding="utf-8") as f:
                        content = f.read()
                self.send_response(200)
                self.send_header("Content-Type", "application/json; charset=utf-8")
                self.end_headers()
                self.wfile.write(content.encode('utf-8'))
            except Exception as e:
                self.send_response(500)
                self.send_header("Content-Type", "application/json; charset=utf-8")
                self.end_headers()
                self.wfile.write(json.dumps({"error": f"Internal Server Error: {str(e)}"}).encode('utf-8'))
            return

        else:
            return super().do_GET()

    def do_POST(self):
        if self.path == "/api/refresh":
            # Force trigger data update
            success = fetch_data_from_source()
            if success:
                self.send_response(200)
                self.send_header("Content-Type", "application/json; charset=utf-8")
                self.end_headers()
                self.wfile.write(json.dumps({"success": True, "message": "Refreshed successfully"}).encode('utf-8'))
            else:
                self.send_response(502)
                self.send_header("Content-Type", "application/json; charset=utf-8")
                self.end_headers()
                self.wfile.write(json.dumps({"success": False, "message": "Failed to contact source API"}).encode('utf-8'))
            return
        else:
            self.send_response(404)
            self.end_headers()

def run_server():
    # Start background scheduler
    scheduler_thread = threading.Thread(target=background_fetch_loop, daemon=True)
    scheduler_thread.start()

    # Define server
    handler = FuelMapRequestHandler
    # Allow address reuse
    socketserver.TCPServer.allow_reuse_address = True
    with socketserver.TCPServer(("", PORT), handler) as httpd:
        log(f"Serving Basra Fuel Map at http://localhost:{PORT}")
        try:
            httpd.serve_forever()
        except KeyboardInterrupt:
            log("Server stopped by user.")

if __name__ == "__main__":
    run_server()
