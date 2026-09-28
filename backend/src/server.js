const express = require('express');
const cors = require('cors');
const pasteRoutes = require('./routes/paste');
const { createPasteLimiter } = require('./middleware/rateLimit');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json({ limit: '600kb' })); // slightly above MAX_CONTENT_SIZE for JSON overhead

// Apply rate limiting only to paste creation
app.use('/api/paste', (req, res, next) => {
  if (req.method === 'POST') return createPasteLimiter(req, res, next);
  next();
});

app.use('/api/paste', pasteRoutes);

app.get('/', (req, res) => {
  res.send('Hushbin backend is running 🚀');
});

app.listen(PORT, () => {
  console.log(`Hushbin backend running on http://localhost:${PORT}`);
});