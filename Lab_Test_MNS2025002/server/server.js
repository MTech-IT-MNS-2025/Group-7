// server.js
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const createMyProgModule = require('./myProg.js'); // if compiled with MODULARIZE=1
const app = express();
app.use(cors());
app.use(bodyParser.json());

// Initialize WASM module for server
let ModulePromise;
if (typeof createMyProgModule === 'function') {
  ModulePromise = createMyProgModule();
} else {
  // If myProg.js exported Module directly (non-modularized), require returns a function too.
  ModulePromise = Promise.resolve(global.Module || require('./myProg.js'));
}

app.post('/compute', async (req, res) => {
  try {
    const { g, p, x } = req.body;
    if (!g || !p || (typeof x === 'undefined')) {
      return res.status(400).json({ error: "expected {g,p,x}" });
    }
    const Module = await ModulePromise;
    // choose random b in [1, p-1]
    const pNum = Number(p);
    if (pNum > Number.MAX_SAFE_INTEGER) {
      return res.status(400).json({ error: "p too big for demo" });
    }
    const bNum = Math.floor(Math.random() * (pNum - 1)) + 1; // simple RNG for server
    // compute y = g^b mod p and K = x^b mod p
    const yNum = Module._powmod(Number(g), bNum, pNum);
    const KNum = Module._powmod(Number(x), bNum, pNum);

    res.json({ K: KNum, y: yNum, b: bNum });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.toString() });
  }
});

app.listen(3000, () => console.log('Server listening on port 3000'));
