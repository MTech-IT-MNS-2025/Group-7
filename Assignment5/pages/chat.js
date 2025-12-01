import { useEffect, useState, useRef } from 'react';
import io from 'socket.io-client';
import * as crypto from '../lib/crypto';
import { useRouter } from 'next/router';

let socket;

export default function ChatPage() {
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [secretKey, setSecretKey] = useState('');
  const [recipient, setRecipient] = useState('');
  const [text, setText] = useState('');
  const [messages, setMessages] = useState([]);
  const [onlineMap, setOnlineMap] = useState({});
  const [isReady, setIsReady] = useState(false);
  const [mounted, setMounted] = useState(false); // New state for client-side rendering check
  const chatRef = useRef(null);

  useEffect(() => {
    if (chatRef.current) chatRef.current.scrollTop = chatRef.current.scrollHeight;
  }, [messages]);

  // Pre-load crypto
  useEffect(() => {
    setMounted(true); // Component has mounted on client
    crypto.loadOQS().then(() => setIsReady(true)).catch(console.error);
  }, []);

  useEffect(() => {
    if (!mounted) return; // Don't run logic until mounted

    const u = localStorage.getItem('username');
    if (!u) { router.push('/'); return; }
    setUsername(u);

    // Prompt for Secret Key (Only stored in RAM state)
    // We wrap in a check to prevent double-prompting in React Strict Mode dev
    if (!secretKey) {
        const sk = prompt("Paste SECRET KEY content to decrypt messages:");
        if (sk) setSecretKey(sk);
    }

    socket = io({ path: '/api/socketio' });
    socket.emit('register_user', u);

    socket.on('online_users', (map) => setOnlineMap(map));
    
    socket.on('receive_message', async (data) => {
      try {
        // Only attempt decryption if we have a key
        if (!secretKey) {
             setMessages(prev => [...prev, { sender: data.sender, text: "🔒 Encrypted (Key Missing)", mine: false }]);
             return;
        }

        const shared = await crypto.decapsulateSecret(data.encryptedData.kemCipherText, secretKey);
        const decText = await crypto.decryptMessage(data.encryptedData.cipherText, data.encryptedData.nonce, shared);
        setMessages(prev => [...prev, { sender: data.sender, text: decText, mine: false }]);
      } catch (e) {
        setMessages(prev => [...prev, { sender: data.sender, text: "🔒 Decryption Failed", mine: false }]);
      }
    });

    return () => {
      if(socket) socket.disconnect();
    };
  }, [mounted, secretKey]); // Depend on mounted

  const handleSend = async (e) => {
    e.preventDefault();
    if (!recipient || !text || !isReady) return;

    try {
        const res = await fetch(`/api/user/${recipient}`);
        if(!res.ok) throw new Error("User not found");
        const { publicKey } = await res.json();

        const { sharedSecret, kemCipherText } = await crypto.encapsulateSecret(publicKey);
        const { cipherText, nonce } = await crypto.encryptMessage(text, sharedSecret);

        socket.emit('send_message', { 
            sender: username, 
            receiver: recipient, 
            encryptedData: { cipherText, nonce, kemCipherText } 
        });

        setMessages(prev => [...prev, { sender: username, text: text, mine: true }]);
        setText('');
    } catch (err) {
        alert(err.message);
    }
  };

  const handleLogout = () => {
    if (typeof window !== 'undefined') {
        localStorage.removeItem('username');
    }
    if (socket) socket.disconnect();
    router.push('/');
  };

  // Prevent hydration mismatch by rendering nothing until mounted
  if (!mounted) return null;

  return (
    <div className="container">
      <div className="row" style={{justifyContent:'space-between', marginBottom: '1rem'}}>
        <div className="title">Chat: {username}</div>
        <div className="row">
            <div style={{fontSize:'0.8em', color: isReady ? '#4caf50' : '#f44336', marginRight: '10px'}}>
                {isReady ? 'Quantum Secure' : 'Loading Security...'}
            </div>
            {/* Button is now safely client-side rendered because entire component waits for mount */}
            <button onClick={handleLogout} className="btn" style={{padding: '5px 10px', fontSize: '0.8em', background: '#f44336', border: 'none'}}>
                Logout
            </button>
        </div>
      </div>

      <div className="card stack">
        <div className="row">
          <input className="input" placeholder="Recipient username" value={recipient} onChange={e=>setRecipient(e.target.value)} />
          <span className="status">{recipient && onlineMap[recipient] ? '🟢 Online' : '⚪ Offline'}</span>
        </div>

        <div ref={chatRef} className="chatWindow">
          {messages.map((m, i) => (
            <div key={i} className={`msg ${m.mine ? 'me' : 'them'}`}>
              <b>{m.sender}: </b>{m.text}
            </div>
          ))}
        </div>

        <form onSubmit={handleSend} className="footer">
          <input className="input" value={text} onChange={e=>setText(e.target.value)} placeholder="Type a message..." />
          <button className="btn" disabled={!isReady || !secretKey}>Send</button>
        </form>
      </div>
    </div>
  );
}
