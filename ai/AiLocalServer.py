from http.server import HTTPServer, BaseHTTPRequestHandler
from threading import Thread
import json

with open("ai\\settings.json", "r") as file:
    settings = json.load(file)

HOST_NAME = settings["hostname"]
PORT = settings["port"]

class aiServer(BaseHTTPRequestHandler):
    def do_GET(self):
        if self.path == "/":
            print("pathg sucks lol")
            self.send_response(404)
            self.end_headers()
            return
        
        self.send_response(200)
        self.send_header("Content-type", "application/json")
        self.end_headers()

    def do_POST(self):
        try:
            self.send_response(200)
            self.send_header("Content-type", "application/json")
            self.end_headers()

            aiResponse = "Hello World!"

            self.wfile.write(json.dumps({"reply": aiResponse}).encode("utf-8"))
        except:
            self.send_response(404)
            self.end_headers()

httpd = HTTPServer((HOST_NAME, PORT), aiServer)

print(f"opened Server at http://{HOST_NAME}:{PORT}")
Thread(target=httpd.serve_forever).start()
#httpd.serve_forever()

input("Press [Enter] to stop serving the server. ")
print("closed Server")
httpd.server_close()
