const app = require('express')();
const http = require('http').Server(app);
const io = require('socket.io')(http);
const port = process.env.PORT || 3000;

let users = new Map();
let channels = ["Global","Channel 1","Channel 2"]

//TODO Spróbować podpiąć SocketIO admin-ui


//Klient łączy się z serwerem
io.on('connection', (socket) => {

  //Dołącz do serwera
  socket.on('join',(username)=>{
    //Dołącz do domyślnego kanału
    socket.join(channels[0]);
    //Dodaj do listy klientów
    users.set(socket.id,username);
    //Wyślij listę kanałó
    socket.emit('load channels',channels);
    //Wyślij klientom nową listę userów
    //Obiekt wysyłany jest serializowany więc mapa nie przejdzie, rzutujemy na obiekt
    let obj = Object.fromEntries(users);
    io.sockets.emit('update users',obj);
  })


  //Wyjdź z serwera
  socket.on('disconnect',()=>{
    //Usuń z listy klientów
    users.delete(socket.id);
    //Wyślij klientom nową listę userów
    //Obiekt wysyłany jest serializowany więc mapa nie przejdzie, rzutujemy na obiekt
    let obj = Object.fromEntries(users);
    io.sockets.emit('update users',obj);
  })

  //Rozsyłanie wiadomości
  socket.on('chat message', (msg, active_channel,timestamp) => {
    //Roześlij wiadomość do wszystkich w kanale włącznie z nadawcą
    io.sockets.in(active_channel).emit('chat message', users.get(socket.id),msg,timestamp);
  });

  //Zmień kanał
  socket.on('changeRoom',(room)=>{
    //Opuść aktualny kanał
    socket.leave(Array.from(socket.rooms)[1]);
    //Dołącz do nowego kanału
    socket.join(room);
  })
});

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

http.listen(port, () => {
  console.log(`Socket.IO server running at http://localhost:${port}/`);
});
