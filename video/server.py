import http.server
import socketserver

PORT = 8000

class Handler(http.server.SimpleHTTPRequestHandler):
    def end_headers(self):
        # 为所有响应添加跨域隔离所需要的头
        self.send_header('Cross-Origin-Opener-Policy', 'same-origin')
        self.send_header('Cross-Origin-Embedder-Policy', 'require-corp')
        super().end_headers()

with socketserver.TCPServer(("", PORT), Handler) as httpd:
    print("服务已启动于 http://localhost:" + str(PORT))
    print("请在浏览器中打开 http://localhost:8000/mp4mp3.html")
    httpd.serve_forever()