'use client';

import { useState } from 'react';
import { modexpClient } from '../../lib/wasmClient';

export default function Page() {
  const [p, setP] = useState('23');
  const [g, setG] = useState('5');
  const [a, setA] = useState('');
  const [x, setX] = useState('');
  const [y, setY] = useState('');
  const [K, setK] = useState('');
  const [status, setStatus] = useState('');

  function randomA(pBig) {
    // simple demo random (not crypto-secure)
    const max = Number(pBig - 3n);
    const r = Math.floor(Math.random() * (Math.max(1, max) + 1));
    return BigInt(2 + r);
  }

  async function handleStart() {
    try {
      setStatus('Computing x...');
      const pBig = BigInt(p);
      const gBig = BigInt(g);

      const aBig = randomA(pBig);
      setA(aBig.toString());

      const xBig = await modexpClient(gBig, aBig, pBig);
      setX(xBig.toString());

      setStatus('Sending to server...');
      const res = await fetch('/api/dh', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          g: gBig.toString(),
          p: pBig.toString(),
          x: xBig.toString()
        })
      });

      const data = await res.json();
      if (data.error) throw new Error(data.error);

      setY(data.y);
      setK(data.K);
      setStatus('Done — shared key computed.');
    } catch (err) {
      setStatus('Error: ' + String(err));
    }
  }

  return (
    <main style={styles.page}>
      <div style={styles.card}>
        <h1 style={styles.title}>Diffie–Hellman</h1>

        <div style={styles.row}>
          <label style={styles.label}>p (prime)</label>
          <input style={styles.input} value={p} onChange={(e) => setP(e.target.value)} />
        </div>

        <div style={styles.row}>
          <label style={styles.label}>g (generator)</label>
          <input style={styles.input} value={g} onChange={(e) => setG(e.target.value)} />
        </div>

        <div style={{ marginTop: 18 }}>
          <button style={styles.button} onClick={handleStart}>Start DH</button>
          <span style={{ marginLeft: 12, color: '#999' }}>{status}</span>
        </div>

        <div style={styles.results}>
          <div style={styles.resultItem}><strong>K (shared key):</strong> <span>{K}</span></div>
          <div style={styles.resultItem}><strong>y (server public):</strong> <span>{y}</span></div>
          <div style={styles.resultItem}><strong>a (private):</strong> <span>{a}</span></div>
        </div>
      </div>
    </main>
  );
}

const styles = {
  page: {
    minHeight: '100vh',
    background: '#0b1020',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
    color: '#e8ebf5',
    fontFamily: 'system-ui, -apple-system, "Segoe UI", Roboto, Arial'
  },
  card: {
    width: 720,
    background: '#141218',
    borderRadius: 14,
    padding: 28,
    boxShadow: '0 8px 30px rgba(0,0,0,0.6)'
  },
  title: { margin: 0, fontSize: 22, marginBottom: 12 },
  row: { display: 'flex', alignItems: 'center', marginBottom: 10 },
  label: { width: 110, color: '#cbd5e1' },
  input: {
    flex: 1,
    padding: '8px 12px',
    borderRadius: 8,
    border: '1px solid #2b2b36',
    background: '#0b1020',
    color: '#e8ebf5'
  },
  button: {
    background: '#e9b9f0',
    color: '#2b1b35',
    padding: '10px 16px',
    borderRadius: 20,
    border: 'none',
    cursor: 'pointer'
  },
  results: {
    marginTop: 18,
    background: '#0e0f13',
    padding: 12,
    borderRadius: 10
  },
  resultItem: {
    marginTop: 8,
    fontSize: 15,
    color: '#dbeafe'
  }
};
