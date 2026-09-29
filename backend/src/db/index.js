const { createClient } = require('@libsql/client');

const db = createClient({
  url: process.env.TURSO_DATABASE_URL,
  authToken: process.env.TURSO_AUTH_TOKEN
});

async function initDb() {
  await db.execute(`
    CREATE TABLE IF NOT EXISTS pastes (
      id TEXT PRIMARY KEY,
      content TEXT NOT NULL,
      language TEXT DEFAULT 'plaintext',
      editable INTEGER DEFAULT 0,
      created_at INTEGER NOT NULL,
      expires_at INTEGER DEFAULT NULL
    )
  `);
}

module.exports = { db, initDb };