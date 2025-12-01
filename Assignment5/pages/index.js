import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

export default function LoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  useEffect(() => {
    const u = localStorage.getItem('username');
    if (u) setUsername(u);
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    const u = username.trim();

    if (!u || !password) {
      alert("Please enter both username and password");
      return;
    }

    const res = await fetch('/api/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username: u, password }),
    });

    const data = await res.json();

    if (res.ok) {
      localStorage.setItem('username', u);
      router.push('/chat');
    } else {
      alert(data.error || 'Invalid username or password');
    }
  };

  return (
    <main className="container stack">
      <div className="title">Private Chat Login</div>
      <div className="sub">Enter your username and password to continue.</div>

      <form onSubmit={handleLogin} className="stack">
        <input
          className="input"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <input
          className="input"
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button className="btn" type="submit">Login</button>
      </form>

      <p className="hint">
        Don’t have an account? <a href="/register">Register here</a>
      </p>
    </main>
  );
}
