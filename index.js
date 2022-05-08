const app = require('express')();
const http = require('http').Server(app);
const io = require('socket.io')(http);
const port = process.env.PORT || 3000;

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

io.on('connection', (socket) => {
  socket.on('chat message', (msg, active_channel) => {
    console.log(msg, active_channel)
    if(active_channel === ""){
      io.emit('chat message', msg);
    }
    else {
      socket.to(active_channel).emit('chat message', msg)
    }
  });
  socket.on('join', function(room) {
    socket.join(room);
    //console.log("join rooom " + room)
  });
  socket.on('leave', function(room) {
    socket.leave(room);
    //console.log("leave rooom " + room)
  });
});


http.listen(port, () => {
  console.log(`Socket.IO server running at http://localhost:${port}/`);
});
