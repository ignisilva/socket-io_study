var WebSocketServer = require("ws").Server;
var wss = new WebSocketServer({ port:1000 });

// 연결이 수립되면 클라이언트에 메시지를 전송하고 클라이언트로부터 메시지를 수신
wss.on("connection", function(ws) {
    ws.send("Hello! I am a server");
    ws.on("message", function(message) {
        console.log("Received: %s", message);
    });
});

console.log("server run, port: 1000");