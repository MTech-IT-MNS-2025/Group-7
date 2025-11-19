const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const fs = require('fs');

const app = express();
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

// Ensure /myprog.js always returns a script: prefer real glue, otherwise serve fallback.
app.get('/myprog.js', (req, res) => {
  const gluePath = path.join(__dirname, 'public', 'myprog.js');
  const fallbackPath = path.join(__dirname, 'public', 'myprog_fallback.js');

  if (fs.existsSync(gluePath)) {
    return res.sendFile(gluePath);
  }
  if (fs.existsSync(fallbackPath)) {
    // Serve fallback under the /myprog.js URL so client code receives Module.cwrap shim
    return res.sendFile(fallbackPath);
  }
  return res.status(404).send('myprog.js not found');
});


let wasmModexp = null;
let wasmStatus = 'not loaded';

// Try Emscripten Node glue (public/myprog.js)
(function tryGlue(){
  try {
    const gluePath = path.join(__dirname, 'public', 'myprog.js');
    if (fs.existsSync(gluePath)) {
      try {
        const glue = require('./public/myprog.js');
        const maybePromise = (typeof glue === 'function') ? glue() : glue;
        Promise.resolve(maybePromise).then(Module => {
          if (Module && Module.cwrap) {
            wasmModexp = Module.cwrap('modexp', 'number', ['number','number','number']);
            wasmStatus = 'node-emscripten-glue';
            console.log('Using emscripten glue (Node) for modexp');
          } else {
            console.warn('Emscripten glue loaded but Module.cwrap not present');
          }
        }).catch(err => {
          console.warn('Emscripten glue loaded but Module init failed:', err);
        });
      } catch (e) {
        console.warn('Failed to require emscripten glue:', e);
      }
    }
  } catch (e) {
    console.warn('Error checking for emscripten glue', e);
  }
})();

// Try raw WASM (public/myprog.wasm) and look for common exported names
(function tryRawWasm(){
  try {
    const wasmPath = path.join(__dirname, 'public', 'myprog.wasm');
    if (fs.existsSync(wasmPath)) {
      const bytes = fs.readFileSync(wasmPath);
      WebAssembly.instantiate(bytes, {}).then(result => {
        const exports = result.instance && result.instance.exports ? result.instance.exports : {};
        // Common exported names: 'modexp' or '_modexp'
        if (typeof exports.modexp === 'function') {
          wasmModexp = function(a,b,n){ return exports.modexp(a,b,n); };
          wasmStatus = 'raw-wasm-modexp';
          console.log('Using raw wasm export: modexp');
        } else if (typeof exports._modexp === 'function') {
          wasmModexp = function(a,b,n){ return exports._modexp(a,b,n); };
          wasmStatus = 'raw-wasm-_modexp';
          console.log('Using raw wasm export: _modexp');
        } else {
          const exps = Object.keys(exports);
          console.warn('WASM present but modexp export not found. exports=', exps);
        }
      }).catch(err => {
        console.warn('Failed to instantiate raw wasm:', err);
      });
    }
  } catch (e) {
    console.warn('Error checking raw wasm', e);
  }
})();

// JS fallback (public/myprog_fallback.js)
(function tryFallback(){
  try {
    const fallbackPath = path.join(__dirname, 'public', 'myprog_fallback.js');
    if (fs.existsSync(fallbackPath)) {
      try {
        const fb = require('./public/myprog_fallback.js');
        if (fb && typeof fb.modexp === 'function') {
          wasmModexp = function(a,b,n){ return fb.modexp(a,b,n); };
          wasmStatus = 'node-js-fallback';
          console.log('Using JS fallback modexp from public/myprog_fallback.js');
        }
      } catch (e) {
        console.warn('Failed to require JS fallback:', e);
      }
    }
  } catch (e) {
    console.warn('Error checking fallback', e);
  }
})();

// helper: random BigInt in [1, p-1]
function randomBigIntBelow(p) {
  const max = BigInt(p) - 1n;
  const bits = max.toString(2).length;
  const bytes = Math.ceil(bits / 8);
  const crypto = require('crypto');
  let r;
  do {
    const buf = crypto.randomBytes(bytes);
    r = 0n;
    for (let i = 0; i < buf.length; i++) r = (r << 8n) + BigInt(buf[i]);
  } while (r === 0n || r > max);
  return r;
}

app.get('/wasm-status', (req, res) => {
  res.json({ status: wasmStatus });
});

app.post('/compute', (req, res) => {
  try {
    const { g, p, x } = req.body;
    if (!g || !p || !x) return res.status(400).send('missing fields: g, p, x required');

    if (!wasmModexp) {
      return res.status(500).send('Server: no modexp implementation available. Place compiled myprog.js/myprog.wasm in public/ or use fallback.');
    }

    const b = randomBigIntBelow(BigInt(p));

    const gNum = Number(g);
    const pNum = Number(p);
    const xNum = Number(x);
    const bNum = Number(b);

    const yNum = wasmModexp(gNum, bNum, pNum);
    const KNum = wasmModexp(xNum, bNum, pNum);

    res.json({ K: String(KNum), y: String(yNum), b: b.toString() });
  } catch (err) {
    console.error('Error in /compute:', err);
    res.status(500).send('server error');
  }
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, '0.0.0.0', () => console.log('Server listening on', PORT, 'WASM status:', wasmStatus));
