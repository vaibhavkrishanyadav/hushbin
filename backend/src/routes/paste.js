const express = require('express');
const { nanoid } = require('nanoid');
const db = require('../db');

const router = express.Router();
const MAX_CONTENT_SIZE = 500 * 1024;

router.post('/', (req, res) => {
  const { content, language, editable } = req.body;

  if (!content || typeof content !== 'string' || content.trim().length === 0) {
    return res.status(400).json({ error: 'Content is required' });
  }
  if (Buffer.byteLength(content, 'utf8') > MAX_CONTENT_SIZE) {
    return res.status(413).json({ error: 'Content too large (max 500KB)' });
  }

  const id = nanoid(8);
  const createdAt = Date.now();

  try {
    const stmt = db.prepare(`
      INSERT INTO pastes (id, content, language, editable, created_at)
      VALUES (?, ?, ?, ?, ?)
    `);
    stmt.run(id, content, language || 'plaintext', editable ? 1 : 0, createdAt);
    res.status(201).json({ id, url: `/${id}` });
  } catch (err) {
    console.error('Error creating paste:', err);
    res.status(500).json({ error: 'Failed to create paste' });
  }
});

router.get('/:id', (req, res) => {
  const { id } = req.params;
  try {
    const stmt = db.prepare('SELECT * FROM pastes WHERE id = ?');
    const paste = stmt.get(id);
    if (!paste) return res.status(404).json({ error: 'Paste not found' });

    if (paste.expires_at && Date.now() > paste.expires_at) {
      db.prepare('DELETE FROM pastes WHERE id = ?').run(id);
      return res.status(404).json({ error: 'Paste has expired' });
    }

    res.json({
      id: paste.id,
      content: paste.content,
      language: paste.language,
      editable: !!paste.editable,
      created_at: paste.created_at
    });
  } catch (err) {
    console.error('Error fetching paste:', err);
    res.status(500).json({ error: 'Failed to fetch paste' });
  }
});

module.exports = router;