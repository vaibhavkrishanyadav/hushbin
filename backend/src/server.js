require('dotenv').config();
const express = require('express');
const cors = require('cors');
const http = require('http');
const { Server } = require('socket.io');
const db = require('./db');
const pasteRoutes = require('./routes/paste');
const { createPasteLimiter } = require('./middleware/rateLimit');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: process.env.FRONTEND_URL }
});

const PORT = process.env.PORT || 3000;

app.use(cors({ origin: process.env.FRONTEND_URL }));
app.use(express.json({ limit: '600kb' }));

app.use('/api/paste', (req, res, next) => {
  if (req.method === 'POST') return createPasteLimiter(req, res, next);
  next();
});
app.use('/api/paste', pasteRoutes);

app.get('/', (req, res) => {
  res.send('Hushbin backend is running 🚀');
});

const saveTimers = new Map();

io.on('connection', (socket) => {
  socket.on('join-paste', (pasteId) => socket.join(pasteId));

  socket.on('content-change', ({ id, content }) => {
    socket.to(id).emit('content-change', content);
    if (saveTimers.has(id)) clearTimeout(saveTimers.get(id));
    const timer = setTimeout(() => {
      try {
        db.prepare('UPDATE pastes SET content = ? WHERE id = ?').run(content, id);
      } catch (err) {
        console.error('Failed to persist live edit:', err);
      }
      saveTimers.delete(id);
    }, 500);
    saveTimers.set(id, timer);
  });
});

server.listen(PORT, () => {
  console.log(`Hushbin backend running on http://localhost:${PORT}`);
});