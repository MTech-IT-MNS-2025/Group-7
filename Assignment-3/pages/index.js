import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

export default function LoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState('');

  useEffect(() => {
    const u = localStorage.getItem('username');
    if (u) setUsername(u);
  }, []);

  const handleLogin = (e) => {
    e.preventDefault();
    const u = username.trim();
    if (!u) return;
    localStorage.setItem('username', u);
    router.push('/chat');
  };

  return (
    <main className="container stack">
      <div className="title">Private Chat Login</div>
      <div className="sub">Enter a username to begin.</div>
      <form onSubmit={handleLogin} className="stack">
        <input
          className="input"
          placeholder="Username"
          value={username}
          onChange={(e)=>setUsername(e.target.value)}
        />
        <button className="btn" type="submit">Continue</button>
      </form>
      <p className="hint">Tip: Open two browser windows, log in with two different usernames, and chat between them.</p>
    </main>
  );
}
