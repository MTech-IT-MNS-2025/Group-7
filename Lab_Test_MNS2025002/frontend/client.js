// client.js
// Wait for Emscripten Module to initialize
Module.onRuntimeInitialized = async function() {
  console.log("WASM module ready");

  const startBtn = document.getElementById('startBtn');
  startBtn.onclick = async () => {
    const p = BigInt(document.getElementById('p').value);
    const g = BigInt(document.getElementById('g').value);

    // 1) choose random a in Z_p*
    const a = await randomZp(p);                // BigInt
    // Note: since our wasm powmod accepts numeric types, ensure p,g,a fit JS Number
    // For lab test use small numbers; here we coerce to Number if safe:
    if (p > Number.MAX_SAFE_INTEGER) {
      alert("p too large for this demo. Use p < 2^53.");
      return;
    }
    const pNum = Number(p);
    const gNum = Number(g);
    const aNum = Number(a);

    // 2) compute x = g^a mod p using wasm
    // Call exported C function _powmod(base, exp, mod) via Module._powmod
    const xNum = Module._powmod(gNum, aNum, pNum);

    // send <g,p,x> to server via POST
    const payload = { g: gNum, p: pNum, x: xNum };
    const resp = await fetch('http://localhost:3000/compute', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    const data = await resp.json();
    // data contains { K, y }
    document.getElementById('K').innerText = data.K;
    document.getElementById('y').innerText = data.y;
    document.getElementById('a').innerText = aNum;
  };
};

// Secure random number in [1, p-1] (returns BigInt)
async function randomZp(p) {
  // Use crypto.getRandomValues with rejection sampling, support BigInt p
  if (p <= 2n) return 1n;
  const byteLen = Math.ceil(Number((p - 1n).toString(2).length) / 8);
  while (true) {
    const buf = new Uint8Array(byteLen);
    crypto.getRandomValues(buf);
    let r = 0n;
    for (let i = 0; i < buf.length; i++) r = (r << 8n) + BigInt(buf[i]);
    r = r % (p - 1n) + 1n; // map to [1, p-1]
    return r;
  }
}
