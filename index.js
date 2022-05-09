const app = require('express')();
const http = require('http').Server(app);
const io = require('socket.io')(http);
const port = process.env.PORT || 3000;

let users = new Map();

//TODO Wysyłać nie sam text ale obiekty z timestampem?
//TODO Spróbować podpiąć SocketIO admin-ui

//FIXME Pod koniec pousuwać niepotrzebne console.logi

//Klient łączy się z serwerem
io.on('connection', (socket) => {

  //Dołącz do serwera
  socket.on('join',(username,channel)=>{
    //Dołącz do kanału
    socket.join(channel);
    //Dodaj do listy klientów
    users.set(socket.id,username);
    //Wyślij klientom nową listę userów
    //TODO
  })


  //Wyjdź z serwera
  socket.on('disconnect',()=>{
    //Usuń z listy klientów
    users.delete(socket.id);
    //Wyślij klientom nową listę userów
    //TODO
  })

  //Rozsyłanie wiadomości
  socket.on('chat message', (msg, active_channel,timestamp) => {
    //Roześlij wiadomość do wszystkich w kanale
    //FIXME ustawić żeby wysyłało też do samego siebie
    socket.to(active_channel).emit('chat message', users.get(socket.id),msg,timestamp);
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
