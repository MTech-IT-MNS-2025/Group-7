import { useRouter } from 'next/router';
import { useState } from 'react';

export default function RegisterPage() {
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');

  const handleRegister = async (e) => {
    e.preventDefault();
    const u = username.trim();

    if (!u || !password || !confirm) {
      alert("Please fill all fields");
      return;
    }
    if (password !== confirm) {
      alert("Passwords do not match");
      return;
    }
    const res = await fetch('/api/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username: u, password }),
    });

    const data = await res.json();

    if (res.ok) {
      alert('Registration successful! You can now log in.');
      router.push('/');
    } else {
      alert(data.error || 'Registration failed');
    }
  };

  return (
    <main className="container stack">
      <div className="title">Register New Account</div>
      <div className="sub">Create your username and password to start chatting.</div>

      <form onSubmit={handleRegister} className="stack">
        <input
          className="input"
          placeholder="Username"
          value={username}
          onChange={(e)=>setUsername(e.target.value)}
        />
        <input
          className="input"
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e)=>setPassword(e.target.value)}
        />
        <input
          className="input"
          type="password"
          placeholder="Confirm Password"
          value={confirm}
          onChange={(e)=>setConfirm(e.target.value)}
        />
        <button className="btn" type="submit">Register</button>
      </form>

      <p className="hint">
        Already have an account?{' '}
        <a href="/">Go to Login</a>
      </p>
    </main>
  );
}
