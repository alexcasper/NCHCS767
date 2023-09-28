from http.server import HTTPServer,SimpleHTTPRequestHandler

class ServerHandler(SimpleHTTPRequestHandler):    
    def do_GET(self):
        print(self.headers)
        SimpleHTTPRequestHandler.do_GET(self)

def run(server_class=HTTPServer, handler_class=ServerHandler):
    server_address = ('localhost', 8000)
    httpd = server_class(server_address, handler_class)
    print("running server")
    httpd.serve_forever()

run()