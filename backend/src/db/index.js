const Database = require('better-sqlite3');
const path = require('path');

const dbPath = process.env.DB_PATH || path.join(__dirname, '../../hushbin.sqlite');
const db = new Database(dbPath);

db.exec(`
  CREATE TABLE IF NOT EXISTS pastes (
    id TEXT PRIMARY KEY,
    content TEXT NOT NULL,
    language TEXT DEFAULT 'plaintext',
    editable INTEGER DEFAULT 0,
    created_at INTEGER NOT NULL,
    expires_at INTEGER DEFAULT NULL
  )
`);

module.exports = db;