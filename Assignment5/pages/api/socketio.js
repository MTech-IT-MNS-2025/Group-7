import { Server } from 'socket.io';
import { dbConnect } from '../../lib/db';
import Message from '../../models/Message';

const users = {};

export const config = { api: { bodyParser: false } };

export default async function handler(req, res) {
  if (!res.socket.server.io) {
    const io = new Server(res.socket.server, { path: '/api/socketio', addTrailingSlash: false });
    res.socket.server.io = io;

    io.on('connection', (socket) => {
      socket.on('register_user', (u) => {
        if(u) { users[u] = socket.id; socket.data.username = u; }
      });
     
      // UPDATED: Destructure encryptedData instead of text
      socket.on('send_message', async ({ sender, receiver, encryptedData }) => {
        try {
            await dbConnect();
            const doc = await Message.create({
                sender,
                receiver,
                encryptedData, // Store the encrypted blob
                timestamp: new Date()
            });

            const socketId = users[receiver];
            if (socketId) {
                io.to(socketId).emit('receive_message', {
                    sender,
                    encryptedData,
                    timestamp: doc.timestamp
                });
            }
        } catch(err) {
            console.error(err);
        }
      });
     
      socket.on('disconnect', () => {
        if(socket.data.username) delete users[socket.data.username];
      });
    });
  }
  res.end();
}
