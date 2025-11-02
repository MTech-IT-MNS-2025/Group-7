# One-to-One Private Messaging — Next.js + Socket.io + MongoDBAtlas

A minimal, fully working 1‑to‑1 private chat built with **Next.js** (pages + API routes), **Socket.io** for realtime, and **MongoDB Atlas** for persistence. Includes login by username, chat page with recipient field, realtime delivery, stored history, online/typing indicators.

## Objective
Design and implement a one‑to‑one private messaging application using Next.js and Socket.io, with messages persisted in MongoDB for chat history and offline delivery.

## Learning Outcomes
1. Build full‑stack apps using Next.js pages & API routes.
2. Implement one‑to‑one realtime messaging with Socket.io.
3. Store messages in MongoDB Atlas for history.
4. Display previous messages on login/open of a chat.
5. Understand session/presence and message routing for private communication.

## Tools & Technologies
- Frontend & Backend: Node.js, Next.js
- Realtime: Socket.io
- Database: MongoDB (+ Mongoose)

---

## Prerequisites
- Node.js 18+
- npm
- MongoDB (local or Atlas) and a connection URI

## Setup & Run
```bash
# 1) Copy env
cp .env.local.example .env.local
# Edit .env.local and set MONGODB_URI

# 2) Install
npm install

# 3) Dev server
npm run dev
# Open http://localhost:3000

# 4) Test the chat
# Open two windows, login with two different usernames.
# Set each other as Recipient and exchange messages.
```

## Project Structure
- `pages/index.js` — Login page
- `pages/chat.js` — Chat UI (recipient, history, typing, send)
- `pages/api/socket.js` — Socket.io server (register, presence, typing, send)
- `pages/api/messages.js` — History API (GET user1/user2)
- `lib/db.js` — MongoDB connect helper
- `models/Message.js` — Message schema
- `styles/globals.css` — Styling

## API Details
- `GET /api/messages?user1=a&user2=b` → chronological history
- Socket Events:
  - `register_user(username)`
  - `send_message({ sender, receiver, text })`
  - `receive_message({ sender, receiver, text, timestamp })`
  - `typing({ from, to, isTyping })`
  - Presence broadcasts: `online_users`, `user_online`, `user_offline`

## Optional Enhancements Included
- Online/Offline status
- "User is typing…" indicator

## Architecture
assignment-3
│
├── 📄 README.md
├── 📄 package.json
├── 📄 next.config.js
├── 📄 .gitignore
├── 📄 .env.example
│
├── 📁 pages/
│   ├── index.js              # Login Page – user enters username
│   ├── chat.js               # Chat Page – real-time messaging interface
│   │
│   └── api/
│       ├── socketio.js       # Socket.io backend server
│       └── messages.js       # Fetch message history from MongoDB
│
├── 📁 lib/
│   └── mongodb.js            # MongoDB Atlas connection setup
│
├── 📁 models/
│   └── Message.js            # Message schema (sender, receiver, text, timestamp)
│
└── 📁 styles/
    └── globals.css           # App styling (basic CSS or Tailwind)


**Screenshot**

<img width="1280" height="832" alt="Screenshot 2025-11-02 at 1 27 09 PM" src="https://github.com/user-attachments/assets/535ad2ca-a53f-4e54-81f3-b99f9355f371" />

<img width="1280" height="832" alt="Screenshot 2025-11-02 at 1 27 53 PM" src="https://github.com/user-attachments/assets/83829760-82f1-4658-8493-d65281b4b503" />








