const Database = require('better-sqlite3');
const path = require('path');

const dbPath = path.join(__dirname, '../../hushbin.sqlite');
const db = new Database(dbPath);

// Create the pastes table if it doesn't exist
db.exec(`
  CREATE TABLE IF NOT EXISTS pastes (
    id TEXT PRIMARY KEY,
    content TEXT NOT NULL,
    language TEXT DEFAULT 'plaintext',
    created_at INTEGER NOT NULL,
    expires_at INTEGER DEFAULT NULL
  )
`);

module.exports = db;