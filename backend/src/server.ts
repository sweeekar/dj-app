import http from 'http';
import { Server } from 'socket.io';
import { createApp } from './app';
import { getPlaybackState } from './services/playlistService';

const PORT = Number(process.env.PORT || 4000);

const app = createApp();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: '*'
  }
});

io.on('connection', (socket) => {
  socket.emit('playback:update', getPlaybackState());
});

setInterval(() => {
  io.emit('playback:update', getPlaybackState());
}, 2000);

server.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`Backend server listening on ${PORT}`);
});
