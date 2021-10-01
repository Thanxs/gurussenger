const express = require('express');
const path = require('path');
const http = require('http');
const socketio = require('socket.io');
const { bgCyan, bgBlackBright} = require('chalk');
const { log : print, NWC, runServerMessage } = require('./utils/log');
const { generateMessage } = require('./utils/messages');
const { addUser, removeUser, getUser, getUsersInRoom } = require('./utils/users');

const app = express();
const server = http.createServer(app);

app.use(express.static(path.join(__dirname, '../public')));

const io = socketio(server);

io.on('connection', (socket) => {
  print(bgCyan(NWC));

  socket.on('join', (options, callback) => {
    const { error, user } = addUser({ id: socket.id, ...options});

    if (error) {
      return callback(error);
    }

    socket.join(user.room);

    socket.emit('message', generateMessage('Admin', 'Welcome!'));
    socket.broadcast.to(user.room).emit('message', generateMessage('Admin', `${user.username} has joined!`));

    io.to(user.room).emit('roomData', {
      room: user.room,
      users: getUsersInRoom(user.room)
    });

    callback();
  });

  socket.on('sendMessage', (message, callback) => {
    const user = getUser(socket.id);

    io.to(user.room).emit('message', generateMessage(user.username, message));
    callback('Delivered!');
  });

  socket.on('sendLocation', (coords, callback) => {
    const user = getUser(socket.id);

    io.to(user.room).emit('locationMessage', generateMessage(user.username, `https://google.com/maps?q=${coords.latitude},${coords.longitude}`));
    callback('Location shared!');
  });

  socket.on('disconnect', () => {
    const user = removeUser(socket.id);

    if (user) {
      io.to(user.room).emit('message', generateMessage('Admin', `${user.username} has left!`));
      io.to(user.room).emit('roomData', {
        room: user.room,
        users: getUsersInRoom(user.room)
      });
    }
  });
})

const PORT = process.env.PORT || 3000;

server.listen(PORT, () => {
  print(bgBlackBright(runServerMessage(PORT)));
});