import { Server } from 'socket.io';
import { dbConnect } from '../../lib/db';
import Message from '../../models/Message';

const users = {}; // { username: socket.id }

export const config = { api: { bodyParser: false } };

export default async function handler(req, res) {
  if (!res.socket.server.io) {
    const io = new Server(res.socket.server, { path: '/api/socketio', addTrailingSlash: false });
    res.socket.server.io = io;

    io.on('connection', async (socket) => {
      socket.on('register_user', (username) => {
        if (!username) return;
        users[username] = socket.id;
        socket.data.username = username;
        io.emit('online_users', Object.fromEntries(Object.keys(users).map(u => [u, true])));
        io.emit('user_online', username);
      });

      socket.on('typing', ({ from, to, isTyping }) => {
        const receiverSocketId = users[to];
        if (receiverSocketId) io.to(receiverSocketId).emit('typing', { from, isTyping: !!isTyping });
      });

      socket.on('send_message', async ({ sender, receiver, text }) => {
        try {
          await dbConnect();
          const doc = await Message.create({ sender, receiver, text, timestamp: new Date() });
          const receiverSocketId = users[receiver];
          if (receiverSocketId) {
            io.to(receiverSocketId).emit('receive_message', { sender, receiver, text, timestamp: doc.timestamp });
          }
          //socket.emit('receive_message', { sender, receiver, text, timestamp: doc.timestamp });
        } catch (e) {
          socket.emit('error_message', { error: 'Failed to send message' });
        }
      });

      socket.on('disconnect', () => {
        const u = socket.data.username;
        if (u && users[u]) {
          delete users[u];
          io.emit('user_offline', u);
          io.emit('online_users', Object.fromEntries(Object.keys(users).map(u => [u, true])));
        }
      });
    });
  }
  res.end();
}


