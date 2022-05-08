const app = require('express')();
const http = require('http').Server(app);
const io = require('socket.io')(http);
const port = process.env.PORT || 3000;

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

io.on('connection', (socket) => {
  //otrzymaj wiadomość
  socket.on('chat message', (msg, active_channel) => {
    console.log(msg, active_channel)
    //jeśli brak kanału do wszystkich
    if(active_channel === ""){
      io.emit('chat message', msg);
    }
    //jeśli kanał do kanału
    else {
      socket.to(active_channel).emit('chat message', msg)
    }
  });
  //dołącz do kanału
  socket.on('join', (room) => {socket.join(room);});
  //odłącz od kanału
  socket.on('leave', (room) => {socket.leave(room);});
});


http.listen(port, () => {
  console.log(`Socket.IO server running at http://localhost:${port}/`);
});
