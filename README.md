# Hushbin

A simple, fast way to share text and code snippets via a short link.

## Features (planned)
- Create a paste with text or code
- Syntax highlighting for code snippets
- Short, typeable share URLs (e.g. `hushbin.io/5g3oXV`)
- Optional expiry (burn after reading / time-based)
- Optional password protection

## Tech Stack
- **Frontend:** React + Vite, Monaco Editor
- **Backend:** Node.js + Express
- **Database:** SQLite (via better-sqlite3)

## Project Structure

```text
hushbin/
├── frontend/          # React app (Vite)
├── backend/           # Express API + SQLite
└── README.md          # Project documentation
```

## Getting Started

### Backend
```bash
cd backend
npm install
npm run dev
```
Runs on `http://localhost:3000` (or whatever port is configured)

### Frontend
```bash
cd frontend
npm install
npm run dev
```
Runs on `http://localhost:5173`

## Status
🚧 Early development — not yet deployed.

## License
MIT
