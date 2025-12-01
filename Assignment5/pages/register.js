import { useState } from 'react';
import * as crypto from '../lib/crypto';
import { useRouter } from 'next/router';

export default function Register() {
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [loading, setLoading] = useState(false);

  const doRegister = async (e) => {
    e.preventDefault();
    if (password !== confirm) return alert("Passwords do not match");
    
    setLoading(true);

    try {
        // This will auto-load the WASM if needed
        const keys = await crypto.generateKEMKeyPair();

        const res = await fetch('/api/register', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ username, password, publicKey: keys.pk })
        });

        if (res.ok) {
            const blob = new Blob([keys.sk], {type: 'text/plain'});
            const a = document.createElement('a');
            a.href = URL.createObjectURL(blob);
            a.download = `${username}_SECRET.txt`;
            a.click();
            
            alert("Registered! Secret Key downloaded.");
            router.push('/');
        } else {
            const d = await res.json();
            alert(d.error || "Registration failed");
        }
    } catch (err) {
        console.error(err);
        alert("Error: " + err.message);
    } finally {
        setLoading(false);
    }
  };

  return (
    <div className="container stack">
      <div className="title">Quantum Register</div>
      <div className="sub">Create account with Post-Quantum Security</div>

      <form onSubmit={doRegister} className="stack">
        <input className="input" placeholder="Username" onChange={e=>setUsername(e.target.value)} />
        <input className="input" type="password" placeholder="Password" onChange={e=>setPassword(e.target.value)} />
        <input className="input" type="password" placeholder="Confirm Password" onChange={e=>setConfirm(e.target.value)} />
        
        <button className="btn" disabled={loading}>
            {loading ? "Generating Keys..." : "Generate & Register"}
        </button>
      </form>
    </div>
  );
}
