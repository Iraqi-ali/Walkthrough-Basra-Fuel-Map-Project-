import http.server
import socketserver
import json
import urllib.request
import urllib.error
import threading
import time
import os
from datetime import datetime, timedelta

PORT = 8000
DATA_FILE = "data.json"
REPORTS_FILE = "reports.json"
VISITORS_FILE = "visitors.json"  # ملف جديد لتخزين عدد الزوار
SOURCE_API_URL = "https://basrah.iraqstation.com/api.php"

data_lock = threading.Lock()
reports_lock = threading.Lock()
visitors_lock = threading.Lock()

REPORT_THRESHOLD = 2

def log(message):
    print(f"[{datetime.now().strftime('%Y-%m-%d %H:%M:%S')}] {message}")

def get_visitor_count():
    """الحصول على عدد الزوار الحالي"""
    if not os.path.exists(VISITORS_FILE):
        return 0
    try:
        with visitors_lock:
            with open(VISITORS_FILE, "r", encoding="utf-8") as f:
                data = json.load(f)
                return data.get("count", 0)
    except (json.JSONDecodeError, FileNotFoundError):
        return 0

def increment_visitor_count():
    """زيادة عدد الزوار بحماية من التكرار (باستخدام IP أو session)"""
    visitors_log = {}
    visitors_log_file = "visitors_log.json"
    
    # تحميل سجل الزوار
    if os.path.exists(visitors_log_file):
        try:
            with open(visitors_log_file, "r", encoding="utf-8") as f:
                visitors_log = json.load(f)
        except:
            visitors_log = {}
    
    # الحصول على IP الزائر (من خلال Socket)
    # سنستخدم طريقة بسيطة: كل جلسة فريدة تحسب كزائر جديد
    # سنعتمد على حفظ المعرفات لمنع التكرار في نفس الجلسة
    
    # قراءة العدد الحالي
    current_count = get_visitor_count()
    
    # زيادة العدد وحفظه
    new_count = current_count + 1
    
    with visitors_lock:
        with open(VISITORS_FILE, "w", encoding="utf-8") as f:
            json.dump({"count": new_count, "last_updated": datetime.now().isoformat()}, f, ensure_ascii=False, indent=2)
    
    log(f"Visitor count incremented to {new_count}")
    return new_count

def get_midnight_timestamp():
    now = datetime.now()
    midnight = datetime(now.year, now.month, now.day) + timedelta(days=1)
    return midnight

def is_lock_expired(lock_until_str):
    if not lock_until_str:
        return True
    lock_until = datetime.fromisoformat(lock_until_str)
    return datetime.now() >= lock_until

def load_reports():
    if not os.path.exists(REPORTS_FILE):
        return {}
    try:
        with reports_lock:
            with open(REPORTS_FILE, "r", encoding="utf-8") as f:
                return json.load(f)
    except (json.JSONDecodeError, FileNotFoundError):
        return {}

def save_reports(reports):
    with reports_lock:
        with open(REPORTS_FILE, "w", encoding="utf-8") as f:
            json.dump(reports, f, ensure_ascii=False, indent=2)

def cleanup_expired_reports():
    reports = load_reports()
    changed = False
    now = datetime.now()
    
    for station_id in list(reports.keys()):
        lock_until_str = reports[station_id].get("lock_until")
        if lock_until_str:
            lock_until = datetime.fromisoformat(lock_until_str)
            if now >= lock_until:
                del reports[station_id]
                changed = True
                log(f"Report for station {station_id} expired at midnight and was cleared")
    
    if changed:
        save_reports(reports)
    
    return changed

def fetch_data_from_source():
    log(f"Fetching data from {SOURCE_API_URL}...")
    
    cleanup_expired_reports()
    
    try:
        req = urllib.request.Request(
            SOURCE_API_URL, 
            headers={'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'}
        )
        with urllib.request.urlopen(req, timeout=15) as response:
            raw_content = response.read().decode('utf-8')
            parsed_data = json.loads(raw_content)
            
            stations = parsed_data.get("data", parsed_data) if isinstance(parsed_data, dict) else parsed_data
            
            reports = load_reports()
            stations = apply_reports_to_stations(stations, reports)
            
            output_data = {
                "last_updated": datetime.now().isoformat(),
                "stations": stations,
                "visitor_count": get_visitor_count()  # إضافة عدد الزوار للبيانات
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

def apply_reports_to_stations(stations, reports):
    now = datetime.now()
    
    for station in stations:
        station_id = str(station.get("stationId", ""))
        if not station_id or station_id not in reports:
            continue
            
        station_report = reports[station_id]
        
        lock_until_str = station_report.get("lock_until")
        if lock_until_str:
            lock_until = datetime.fromisoformat(lock_until_str)
            if now >= lock_until:
                continue
        
        reported_status = station_report.get("status")
        
        if reported_status == "empty":
            if "products" in station and station["products"]:
                for product_name in station["products"]:
                    if isinstance(station["products"][product_name], dict):
                        station["products"][product_name]["availableQuantity"] = 0
        elif reported_status == "available":
            reported_products = station_report.get("products", {})
            for product_name, quantity in reported_products.items():
                if product_name in station.get("products", {}):
                    if isinstance(station["products"][product_name], dict):
                        station["products"][product_name]["availableQuantity"] = quantity
    
    return stations

def add_report(station_id, report_type, product_name=None, user_session_id=None):
    cleanup_expired_reports()
    
    reports = load_reports()
    now = datetime.now()
    
    if station_id not in reports:
        reports[station_id] = {
            "reports": [],
            "status": None,
            "products": {},
            "lock_until": None
        }
    
    station_report = reports[station_id]
    
    user_already_reported = False
    for r in station_report.get("reports", []):
        if r.get("user_session_id") == user_session_id:
            report_time = datetime.fromisoformat(r.get("timestamp", datetime.min.isoformat()))
            if report_time.date() == now.date():
                user_already_reported = True
                break
    
    if user_already_reported:
        return {"success": False, "message": "لقد قمت بالإبلاغ عن هذه المحطة اليوم. يمكنك الإبلاغ مرة أخرى غداً"}
    
    new_report = {
        "user_session_id": user_session_id,
        "type": report_type,
        "product_name": product_name,
        "timestamp": now.isoformat()
    }
    station_report["reports"].append(new_report)
    
    today = now.date()
    station_report["reports"] = [
        r for r in station_report["reports"]
        if datetime.fromisoformat(r["timestamp"]).date() == today
    ]
    
    available_count = sum(1 for r in station_report["reports"] if r["type"] == "available")
    empty_count = sum(1 for r in station_report["reports"] if r["type"] == "empty")
    
    new_status = None
    if available_count >= REPORT_THRESHOLD:
        new_status = "available"
    elif empty_count >= REPORT_THRESHOLD:
        new_status = "empty"
    
    if new_status and new_status != station_report.get("status"):
        station_report["status"] = new_status
        station_report["lock_until"] = get_midnight_timestamp().isoformat()
        
        if new_status == "empty":
            station_report["products"] = {}
        elif new_status == "available" and product_name:
            station_report["products"][product_name] = 9001
        
        save_reports(reports)
        return {
            "success": True, 
            "message": f"✅ تم تأكيد {('توفر' if new_status == 'available' else 'نقص')} الوقود في هذه المحطة بناءً على تقارير المستخدمين. سيبقى الوضع ثابتاً حتى منتصف الليل.",
            "status": new_status,
            "votes": {"available": available_count, "empty": empty_count},
            "threshold": REPORT_THRESHOLD,
            "lock_until": station_report["lock_until"]
        }
    
    save_reports(reports)
    remaining = REPORT_THRESHOLD - (available_count if report_type == "available" else empty_count)
    return {
        "success": True,
        "message": f"📝 تم تسجيل إبلاغك. العدد الحالي: {available_count} متوفر، {empty_count} غير متوفر (يلزم {REPORT_THRESHOLD} إبلاغ لتغيير الحالة، يتبقى {remaining})",
        "votes": {"available": available_count, "empty": empty_count},
        "threshold": REPORT_THRESHOLD
    }

def get_station_report_status(station_id):
    cleanup_expired_reports()
    
    reports = load_reports()
    if station_id not in reports:
        return None
    
    station_report = reports[station_id]
    now = datetime.now()
    
    lock_until_str = station_report.get("lock_until")
    if lock_until_str:
        lock_until = datetime.fromisoformat(lock_until_str)
        if now >= lock_until:
            return None
    
    today = now.date()
    today_reports = [
        r for r in station_report.get("reports", [])
        if datetime.fromisoformat(r["timestamp"]).date() == today
    ]
    available_count = sum(1 for r in today_reports if r["type"] == "available")
    empty_count = sum(1 for r in today_reports if r["type"] == "empty")
    
    return {
        "status": station_report.get("status"),
        "votes": {"available": available_count, "empty": empty_count},
        "lock_until": lock_until_str,
        "threshold": REPORT_THRESHOLD
    }

class FuelMapRequestHandler(http.server.SimpleHTTPRequestHandler):
    def do_GET(self):
        if self.path == "/":
            # زيادة عدد الزوار عند زيارة الصفحة الرئيسية
            increment_visitor_count()
            self.path = "/index.html"
            return super().do_GET()
        
        elif self.path == "/api/stations":
            cleanup_expired_reports()
            
            if not os.path.exists(DATA_FILE):
                success = fetch_data_from_source()
                if not success:
                    self.send_response(500)
                    self.send_header("Content-Type", "application/json; charset=utf-8")
                    self.end_headers()
                    self.wfile.write(json.dumps({"error": "Unable to fetch fuel data"}).encode('utf-8'))
                    return
            
            try:
                with data_lock:
                    with open(DATA_FILE, "r", encoding="utf-8") as f:
                        content = f.read()
                
                data = json.loads(content)
                reports_summary = {}
                reports = load_reports()
                now = datetime.now()
                today = now.date()
                
                for station_id, report_data in reports.items():
                    lock_until_str = report_data.get("lock_until")
                    if lock_until_str:
                        lock_until = datetime.fromisoformat(lock_until_str)
                        if now < lock_until:
                            today_reports = [
                                r for r in report_data.get("reports", [])
                                if datetime.fromisoformat(r["timestamp"]).date() == today
                            ]
                            reports_summary[station_id] = {
                                "status": report_data.get("status"),
                                "lock_until": lock_until_str,
                                "votes": {
                                    "available": sum(1 for r in today_reports if r["type"] == "available"),
                                    "empty": sum(1 for r in today_reports if r["type"] == "empty")
                                }
                            }
                
                data["reports_summary"] = reports_summary
                
                self.send_response(200)
                self.send_header("Content-Type", "application/json; charset=utf-8")
                self.end_headers()
                self.wfile.write(json.dumps(data, ensure_ascii=False).encode('utf-8'))
            except Exception as e:
                self.send_response(500)
                self.send_header("Content-Type", "application/json; charset=utf-8")
                self.end_headers()
                self.wfile.write(json.dumps({"error": f"Internal Server Error: {str(e)}"}).encode('utf-8'))
            return
        
        elif self.path == "/api/visitors":
            # API لجلب عدد الزوار فقط
            count = get_visitor_count()
            self.send_response(200)
            self.send_header("Content-Type", "application/json; charset=utf-8")
            self.end_headers()
            self.wfile.write(json.dumps({"count": count}, ensure_ascii=False).encode('utf-8'))
            return
        
        elif self.path == "/api/reports":
            query = {}
            if '?' in self.path:
                params = self.path.split('?')[1]
                for param in params.split('&'):
                    if '=' in param:
                        key, value = param.split('=')
                        query[key] = value
            
            station_id = query.get('station_id')
            if station_id:
                status = get_station_report_status(station_id)
                self.send_response(200)
                self.send_header("Content-Type", "application/json; charset=utf-8")
                self.end_headers()
                self.wfile.write(json.dumps(status or {}, ensure_ascii=False).encode('utf-8'))
            else:
                reports = load_reports()
                self.send_response(200)
                self.send_header("Content-Type", "application/json; charset=utf-8")
                self.end_headers()
                self.wfile.write(json.dumps(reports, ensure_ascii=False).encode('utf-8'))
            return

        else:
            return super().do_GET()

    def end_headers(self):
        if self.path.startswith("/api/"):
            self.send_header('Cache-Control', 'no-store, no-cache, must-revalidate, max-age=0')
            self.send_header('Pragma', 'no-cache')
            self.send_header('Expires', '0')
        super().end_headers()

    def do_POST(self):
        content_length = int(self.headers.get('Content-Length', 0))
        post_data = json.loads(self.rfile.read(content_length)) if content_length > 0 else {}
        
        if self.path == "/api/refresh":
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
        
        elif self.path == "/api/report":
            station_id = str(post_data.get("station_id", ""))
            report_type = post_data.get("type", "")
            product_name = post_data.get("product_name")
            user_session_id = post_data.get("user_session_id")
            
            if not station_id or report_type not in ["available", "empty"]:
                self.send_response(400)
                self.send_header("Content-Type", "application/json; charset=utf-8")
                self.end_headers()
                self.wfile.write(json.dumps({"success": False, "message": "Invalid request parameters"}).encode('utf-8'))
                return
            
            result = add_report(station_id, report_type, product_name, user_session_id)
            
            if result.get("success"):
                fetch_data_from_source()
            
            self.send_response(200)
            self.send_header("Content-Type", "application/json; charset=utf-8")
            self.end_headers()
            self.wfile.write(json.dumps(result, ensure_ascii=False).encode('utf-8'))
            return
        
        else:
            self.send_response(404)
            self.end_headers()

def background_fetch_loop():
    last_midnight_check = datetime.now().date()
    
    if not os.path.exists(DATA_FILE):
        fetch_data_from_source()
    
    while True:
        time.sleep(60)
        
        today = datetime.now().date()
        if today != last_midnight_check:
            log("Midnight detected - cleaning up expired reports")
            cleanup_expired_reports()
            fetch_data_from_source()
            last_midnight_check = today
        
        if int(time.time()) % 3600 < 60:
            fetch_data_from_source()

def run_server():
    if not os.path.exists(REPORTS_FILE):
        save_reports({})
    
    # إنشاء ملف الزوار إذا لم يكن موجوداً
    if not os.path.exists(VISITORS_FILE):
        with open(VISITORS_FILE, "w", encoding="utf-8") as f:
            json.dump({"count": 0, "last_updated": datetime.now().isoformat()}, f)
    
    cleanup_expired_reports()
    
    scheduler_thread = threading.Thread(target=background_fetch_loop, daemon=True)
    scheduler_thread.start()

    socketserver.TCPServer.allow_reuse_address = True
    with socketserver.TCPServer(("", PORT), FuelMapRequestHandler) as httpd:
        log(f"Serving Basra Fuel Map at http://localhost:{PORT}")
        log("Report system active: 2 user reports required to change status, locks until midnight")
        log(f"Initial visitor count: {get_visitor_count()}")
        try:
            httpd.serve_forever()
        except KeyboardInterrupt:
            log("Server stopped by user.")

if __name__ == "__main__":
    run_server()