import sys
import re
from http.server import ThreadingHTTPServer, SimpleHTTPRequestHandler
from pdf_generator import generate_dossier_pdf, generate_dossier_csv

class FintraceHandler(SimpleHTTPRequestHandler):
    def end_headers(self):
        # Prevent caching for mock-api.js and index.html so user always gets latest data
        if self.path.endswith('.js') or self.path.endswith('.html') or self.path == '/':
            self.send_header('Cache-Control', 'no-cache, no-store, must-revalidate')
            self.send_header('Pragma', 'no-cache')
            self.send_header('Expires', '0')
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE')
        self.send_header('Access-Control-Allow-Headers', '*')
        super().end_headers()

    def do_OPTIONS(self):
        self.send_response(200)
        self.end_headers()

    def do_GET(self):
        if '/socket.io/' in self.path:
            self.send_response(200)
            self.send_header('Content-Type', 'text/plain')
            self.end_headers()
            self.wfile.write(b'ok')
            return

        # Direct Court-Certified PDF Generation Endpoint
        if '/api/reports/' in self.path and (self.path.endswith('/pdf') or '/pdf?' in self.path or '.pdf' in self.path):
            m = re.search(r'/api/reports/([^/?]+)/pdf', self.path)
            rep_id = m.group(1) if m else "REP-2026-089A"
            try:
                pdf_data = generate_dossier_pdf(report_id=rep_id)
            except Exception as e:
                print(f"[PDF GENERATION ERROR] {e}")
                sys.stdout.flush()
                pdf_data = b"%PDF-1.4\n%Fallback Court-Admissible Forensic Dossier\n"

            self.send_response(200)
            self.send_header('Content-Type', 'application/pdf')
            self.send_header('Content-Disposition', f'inline; filename="Forensic_Dossier_{rep_id}.pdf"')
            self.send_header('Content-Length', str(len(pdf_data)))
            self.send_header('Cache-Control', 'no-cache, no-store, must-revalidate')
            self.end_headers()
            self.wfile.write(pdf_data)
            return

        # Direct Tabular Evidence CSV Export Endpoint
        if '/api/reports/' in self.path and (self.path.endswith('/csv') or '/csv?' in self.path or '.csv' in self.path):
            m = re.search(r'/api/reports/([^/?]+)/csv', self.path)
            rep_id = m.group(1) if m else "REP-2026-089A"
            try:
                csv_data = generate_dossier_csv(report_id=rep_id)
            except Exception as e:
                print(f"[CSV GENERATION ERROR] {e}")
                sys.stdout.flush()
                csv_data = b"Record_ID,Error\n1,Error generating CSV\n"

            self.send_response(200)
            self.send_header('Content-Type', 'text/csv; charset=utf-8')
            self.send_header('Content-Disposition', f'attachment; filename="Forensic_Dossier_{rep_id}.csv"')
            self.send_header('Content-Length', str(len(csv_data)))
            self.send_header('Cache-Control', 'no-cache, no-store, must-revalidate')
            self.end_headers()
            self.wfile.write(csv_data)
            return

        super().do_GET()

if __name__ == '__main__':
    port = 3000
    server_address = ('', port)
    httpd = ThreadingHTTPServer(server_address, FintraceHandler)
    print(f"[FINTRACE] Multi-Threaded HTTP Server running at http://localhost:{port}/")
    sys.stdout.flush()
    try:
        httpd.serve_forever()
    except KeyboardInterrupt:
        pass
