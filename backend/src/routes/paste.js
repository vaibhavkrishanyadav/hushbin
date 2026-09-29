const express = require('express');
const { nanoid } = require('nanoid');
const db = require('../db');

const router = express.Router();
const MAX_CONTENT_SIZE = 500 * 1024;

// Map expiry option → milliseconds (null = never)
const EXPIRY_OPTIONS = {
  never: null,
  '1h': 60 * 60 * 1000,
  '24h': 24 * 60 * 60 * 1000,
  '48h': 48 * 60 * 60 * 1000,
  '7d': 7 * 24 * 60 * 60 * 1000
};

router.post('/', (req, res) => {
  const { content, language, editable, expiry } = req.body;

  if (!content || typeof content !== 'string' || content.trim().length === 0) {
    return res.status(400).json({ error: 'Content is required' });
  }
  if (Buffer.byteLength(content, 'utf8') > MAX_CONTENT_SIZE) {
    return res.status(413).json({ error: 'Content too large (max 500KB)' });
  }

  const createdAt = Date.now();
  const expiryKey = expiry && EXPIRY_OPTIONS.hasOwnProperty(expiry) ? expiry : 'never';
  const durationMs = EXPIRY_OPTIONS[expiryKey];
  const expiresAt = durationMs ? createdAt + durationMs : null;

  const stmt = db.prepare(`
    INSERT INTO pastes (id, content, language, editable, created_at, expires_at)
    VALUES (?, ?, ?, ?, ?, ?)
  `);

  const MAX_RETRIES = 5;
  for (let attempt = 0; attempt < MAX_RETRIES; attempt++) {
    const id = nanoid(8);
    try {
      stmt.run(id, content, language || 'plaintext', editable ? 1 : 0, createdAt, expiresAt);
      return res.status(201).json({ id, url: `/${id}` }); // success
    } catch (err) {
      if (err.code === 'SQLITE_CONSTRAINT_PRIMARYKEY') {
        continue; // collision — try again with a new id
      }
      console.error('Error creating snippet:', err);
      return res.status(500).json({ error: 'Failed to create snippet' });
    }
  }

  res.status(500).json({ error: 'Could not generate a unique link. Please try again.' });
});

router.get('/:id', (req, res) => {
  const { id } = req.params;
  try {
    const stmt = db.prepare('SELECT * FROM pastes WHERE id = ?');
    const snippet = stmt.get(id);
    if (!snippet) return res.status(404).json({ error: 'Snippet not found' });

    if (snippet.expires_at && Date.now() > snippet.expires_at) {
      db.prepare('DELETE FROM pastes WHERE id = ?').run(id);
      return res.status(404).json({ error: 'This snippet has expired' });
    }

    res.json({
      id: snippet.id,
      content: snippet.content,
      language: snippet.language,
      editable: !!snippet.editable,
      created_at: snippet.created_at,
      expires_at: snippet.expires_at
    });
  } catch (err) {
    console.error('Error fetching snippet:', err);
    res.status(500).json({ error: 'Failed to fetch snippet' });
  }
});

module.exports = router;