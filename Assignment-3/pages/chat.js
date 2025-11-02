import { useEffect, useRef, useState } from 'react';
import io from 'socket.io-client';

let socket;

export default function ChatPage() {
  const [username, setUsername] = useState('');
  const [recipient, setRecipient] = useState('');
  const [text, setText] = useState('');
  const [messages, setMessages] = useState([]);
  const [onlineMap, setOnlineMap] = useState({});
  const [typing, setTyping] = useState({});
  const lastTypedRef = useRef(0);
  const chatRef = useRef(null);

  useEffect(() => {
    if (chatRef.current) chatRef.current.scrollTop = chatRef.current.scrollHeight;
  }, [messages]);

  useEffect(() => {
    const u = localStorage.getItem('username');
    if (!u) { window.location.href = '/'; return; }
    setUsername(u);

    if (!socket) socket = io({ path: '/api/socketio' });
    socket.emit('register_user', u);

    socket.on('online_users', (map) => setOnlineMap(map));
    socket.on('user_online', (u) => setOnlineMap((m)=>({ ...m, [u]: true })));
    socket.on('user_offline', (u) => setOnlineMap((m)=>{ const copy={...m}; delete copy[u]; return copy; }));
    socket.on('receive_message', (msg) => setMessages((prev) => [...prev, { ...msg, mine: msg.sender === username }]));
    socket.on('typing', ({ from, isTyping }) => {
      setTyping((t)=>({ ...t, [from]: isTyping }));
      if (isTyping) setTimeout(()=> setTyping((t)=>({ ...t, [from]: false })), 1500);
    });

    return () => {
      if (socket) {
        socket.off('receive_message');
        socket.off('online_users');
        socket.off('user_online');
        socket.off('user_offline');
        socket.off('typing');
        socket.disconnect();
        socket = null;
      }
    };
  }, []);

  useEffect(() => {
    async function loadHistory() {
      if (!username || !recipient) return;
      const res = await fetch(`/api/messages?user1=${encodeURIComponent(username)}&user2=${encodeURIComponent(recipient)}`);
      if (res.ok) {
        const history = await res.json();
        setMessages(history.map(m => ({ ...m, mine: m.sender === username })));
      }
    }
    loadHistory();
  }, [username, recipient]);

  const sendTyping = () => {
    const now = Date.now();
    if (now - lastTypedRef.current > 400) {
      lastTypedRef.current = now;
      socket.emit('typing', { from: username, to: recipient, isTyping: true });
    }
  };

  const handleSend = (e) => {
    e.preventDefault();
    const t = text.trim();
    const r = recipient.trim();
    if (!t || !r) return;
    setMessages(prev => [...prev, { sender: username, receiver: r, text: t, mine:true, timestamp: new Date().toISOString() }]);
    setText('');
    socket.emit('send_message', { sender: username, receiver: r, text: t });
  };

  const isRecipientOnline = !!onlineMap[recipient];

  return (
    <main className="container stack">
      <div className="row" style={{justifyContent:'space-between'}}>
        <div className="title">One‑to‑One Chat</div>
        <div className="status">Logged in as <b>{username}</b></div>
      </div>
      <div className="card stack">
        <div className="row">
          <input className="input" placeholder="Recipient username"
                 value={recipient} onChange={(e)=>setRecipient(e.target.value)} />
          <span className="status">
            Status: {recipient ? (isRecipientOnline ? 'Online' : 'Offline') : '—'}
            {recipient && typing[recipient] ? <span className="badge">typing…</span> : null}
          </span>
        </div>
        <div ref={chatRef} className="chatWindow">
          {messages.map((m, i) => (
            <div key={i} className={`msg ${m.mine ? 'me' : 'them'}`}>
              {!m.mine && <div className="status"><b>{m.sender}</b></div>}
              <div>{m.text}</div>
              <div className="status">{new Date(m.timestamp || m.createdAt || Date.now()).toLocaleTimeString()}</div>
            </div>
          ))}
          {!messages.length && <div className="sub">No messages yet. Say hi! 👋</div>}
        </div>
        <form onSubmit={handleSend} className="footer">
          <input className="input" placeholder="Type a message"
                 value={text}
                 onChange={(e)=>{ setText(e.target.value); sendTyping(); }} />
          <button className="btn" type="submit">Send</button>
        </form>
      </div>
      <p className="hint">Messages are persisted in MongoDB. Offline users will see them on next load.</p>
    </main>
  );
}
