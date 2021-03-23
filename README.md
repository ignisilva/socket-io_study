
# WebSocket

- 클라이언트 서버 양방향 연결 채널을 구성하는 HTML5 프로토콜
- 서버로 메시지를 보내고 요청없이 응답을 받는 것이 가능 (지속적이고 완전한 양방향 연결 스트림)
    - 클라이언트의 주기적이고 지속적인 polling 필요 없음

- 단점
    - 오래된 브라우저의 경우 지원하지 않는 경우가 있음

# Socket.io

- 브라우저간 호환 및 이전 버전 호환을 고려하여 nodejs를 위해 만들어진 Cross-platform Websocket API

# Real-time chat app

- socketio-nodejs
    - 사용 기술: express, socket.io

- server쪽 함수
    - ```
        클라이언트가 전송한 메시지 수신
        현재 접속되어 있는 클라이언트로부터의 메시지를 수신하기 위해서는 on 메소드를 사용한다.
        
        Parameter	Description
        ==================================================================================
        event name	클라이언트가 메시지 송신 시 지정한 이벤트 명(string)
        function	    이벤트 핸들러. 핸들러 함수의 인자로 클라이언트가 송신한 메시지가 전달된다.

        클라이언트에게 메시지 송신
        
        Method	                Description
        ================================================================================================
        io.emit	                접속된 모든 클라이언트에게 메시지를 전송한다.
        socket.emit	            메시지를 전송한 클라이언트에게만 메시지를 전송한다.
        socket.broadcast.emit	메시지를 전송한 클라이언트를 제외한 모든 클라이언트에게 메시지를 전송한다.
        io.to(id).emit	        특정 클라이언트에게만 메시지를 전송한다. id는 socket 객체의 id 속성값이다.

        Parameter	Description
        ===================================================
        event name	이벤트 명(string)
        msg	        송신 메시지(string or object)
      ```

- client쪽 함수
    - ```
        // socket.io 서버에 접속한다
        var socket = io();

        서버로의 메시지 송신
        현재 접속되어 있는 서버로 메시지를 송신하기 위해서는 emit 메소드를 사용한다.

        Parameter	    Description
        ===============================================
        event name	    이벤트 명(string)
        msg	            송신 메시지(string or object)


        서버로부터의 메시지 수신
        현재 접속되어 있는 서버로부터의 메시지를 수신하기 위해서는 on 메소드를 사용한다.

        Parameter	Description
        ==============================================================
        event name	서버가 메시지 송신 시 지정한 이벤트 명(string)
        function	이벤트 핸들러. 핸들러 함수의 인자에 서버가 송신한 메시지가 전달된다.
      ```

- Namespace
    - socketio는 서로다른 엔드포인트 또는 경로를 할당하는 의미로 namespace를 지정할 수 있다
    - 지정하지 않는다면 default namespace인 '/'를 사용하게 된다
    - 사용자 지정 namespace의 예시
        - ```
            // server side
            var nsp = io.of('/custom-namespace');

            nsp.on('connection', function(socket) {
                console.log('someone connected);
            })
            nsp.emit('hi', 'everyone!');

            //client side
            var socket = io('/custom-namespace');
          ```

- Room
    - 각 namespace내에서 임의의 채널을 지정할 수 있음
    - 이를 room이라 칭하고, 각 클라이언트는 join(속해있는) room 안에서만 데이터 송수신이 가능
    - 각 클라이언트는 socket을 가지고 socket은 namespace를 가지고 namespace는 room을 가진다
    - 클라:socket(1:n), socket:namespace(?), namespace:room(1:n)
    - 각 소켓은 랜덤하고 유일하게 작성된 socket.id로 구별, socket.id를 room 식별자로 사용하여 room을 생성하고 join 시킨다
    - room에 join하기 위해서는 join메소드 사용
    - room 예시
        - ```
            // server side
            var app = require('express');
            var server = require('http').createServer(app);
            var io = require('socket.io')(server);

            app.get('/', function(req,res) {
                res.sendFile(__dirname + '/index.html');
            })

            // namespace '/chat' 에 접속한다
            var chat = io.of('/chat').on('connection', function(socket) {
                socket.on('chat message', funciton(data) {
                    console.log('message from client: ', data);

                    var name = socket.name = data.name;
                    var room = socket.room = data.room;

                    // room에 join한다
                    socket.join(room);
                    // room에 join되어있는 클라이언트에게 메시지를 전송
                    chat.to(room).emit('chat message', data.msg);
                     
                })
            })

            server.listen(3000, function() {
                console.log('Socket IO server listening on port 3000');
            })

            // client side
            <!DOCTYPE html>
            <html>
            <head>
            <meta charset="utf-8">
            <title>Socket.io Chat Example</title>
            <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css">
            </head>
            <body>
            <div class="container">
                <h3>Socket.io Chat Example</h3>
                <!-- <form class="form-inline"> -->
                <form class="form-horizontal">
                <div class="form-group">
                    <label for="name" class="col-sm-2 control-label">Name</label>
                    <div class="col-sm-10">
                    <input type="text" class="form-control" id="name" placeholder="Name">
                    </div>
                </div>
                <div class="form-group">
                    <label for="room" class="col-sm-2 control-label">Room</label>
                    <div class="col-sm-10">
                    <input type="text" class="form-control" id="room" placeholder="Room">
                    </div>
                </div>
                <div class="form-group">
                    <label for="msg" class="col-sm-2 control-label">Message</label>
                    <div class="col-sm-10">
                    <input type="text" class="form-control" id="msg" placeholder="Message">
                    </div>
                </div>
                <div class="form-group">
                    <div class="col-sm-offset-2 col-sm-10">
                    <button type="submit" class="btn btn-default">Send</button>
                    </div>
                </div>
                </form>
                <ul id="chat"></ul>
            </div>
            <script src="https://ajax.googleapis.com/ajax/libs/jquery/2.2.4/jquery.min.js"></script>
            <script src="/socket.io/socket.io.js"></script>
            <script>
                $(function() {
                // 지정 namespace로 접속한다
                var chat = io('http://localhost:3000/chat'),
                    news = io('/news');

                $("form").submit(function(e) {
                    e.preventDefault();

                    // 서버로 자신의 정보를 전송한다.
                    chat.emit("chat message", {
                    name: $("#name").val(),
                    room: $("#room").val(),
                    msg: $("#msg").val()
                    });
                });

                // 서버로부터의 메시지가 수신되면
                chat.on("chat message", function(data) {
                    $("#chat").append($('<li>').text(data));
                });
                });
            </script>
            </body>
            </html>
          ```
