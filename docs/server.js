const express = require('express');

const app = express();
const server = app.listen(3000);

app.use(express.static('public'));

console.log("My socket server is running");

const short = require('short-uuid');

const Player = require('./Player');

// const MIDIPlayer = require('midi-player-js');
// const MidiPlayer = new MIDIPlayer.Player(function (event) {
//   console.log(event);
// });

// MidiPlayer.loadFile('public/audio/mario.mid');
// MidiPlayer.play();

const GAMER = 0;
const MUSICIAN = 1;
const ROOM_MAX_CAPACITY = 2;

const socket = require('socket.io');

const io = socket(server);

const rooms = [short.generate()];
let players = [];
setInterval(updateGame, 16);

io.on('connection', socket => {
  console.log('new connection: ' + socket.id);

  socket.on('add player to room', playerRole => {
    const roomId = getRoomForRole(playerRole);

    players.push(new Player(socket.id, roomId, playerRole));

    console.log(`Adding ${socket.id} to ${roomId}`);

    socket.join(roomId);
  });

  socket.on('remove player from room', () => {
    let playerToRemove = players.filter(player => player.id === socket.id)[0];
    console.log(`Removing ${playerToRemove.id} from ${playerToRemove.roomId}`);
    players = players.filter(player => player.id !== socket.id);
  });

  socket.on('ready', () => {
    let player = players.filter(player => player.id === socket.id)[0];
    player.isReady = true;

    console.log(`${player.id} is ready!`);

    if (roomHasAllPlayersReady(player.roomId)) {
      io.emit('game start', Math.random(10000));
    }
  });

  socket.on('not ready', () => {
    let player = players.filter(player => player.id === socket.id)[0];
    player.isReady = false;

    console.log(`${player.id} is not ready!`);
  });

  socket.on('disconnect', () => {
    console.log(socket.id + ' disconnected');
    players = players.filter(player => player.id !== socket.id);
  });

  socket.on('pause or quit', (data) => {
    socket.broadcast.emit('keyPressed', data);
  });
});

function updateGame() {
  for (const room of rooms) {
    const playersInRoom = players.filter(p => p.roomId === room);
    io.to(room).emit('heartbeat', playersInRoom);
  }
}

function getRoomForRole(role) {
  let leastPopulatedCount = Infinity;
  let leastPopulatedRoom = rooms[0];
  for (const room of rooms) {
    const count = players.filter(p => p.roomId === room).length;
    if (count < leastPopulatedCount) {
      leastPopulatedCount = count;
      leastPopulatedRoom = room;
    }
  }

  if (leastPopulatedCount >= ROOM_MAX_CAPACITY || roomHasPlayerWithSameRole(leastPopulatedRoom, role)) {
    const newRoom = short.generate();
    console.log('Creating new room', newRoom);
    rooms.push(newRoom);
    leastPopulatedRoom = newRoom;
  }

  return leastPopulatedRoom;
}

function roomHasPlayerWithSameRole(room, role) {
  let playersInRoom = players.filter(p => p.roomId === room);
  let playersWithRole = playersInRoom.filter(p => p.role === role);
  return (playersWithRole.length > 0);
}

function roomHasAllPlayersReady(room) {
  let playersInRoom = players.filter(p => p.roomId === room);
  return (playersInRoom.length > 1 && playersInRoom.filter(p => p.isReady).length === playersInRoom.length);
}