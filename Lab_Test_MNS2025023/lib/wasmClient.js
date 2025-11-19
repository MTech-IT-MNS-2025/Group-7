// lib/wasmClient.js
let modulePromise = null;

function loadEmscriptenGlue() {
  return new Promise((resolve, reject) => {
    if (typeof window.createMyProgModule === 'function') return resolve();
    const script = document.createElement('script');
    script.src = '/myprog.js';
    script.onload = () => resolve();
    script.onerror = (e) => reject(new Error('Failed to load /myprog.js: ' + e));
    document.head.appendChild(script);
  });
}

export async function loadWasmClient() {
  if (modulePromise) return modulePromise;

  await loadEmscriptenGlue();

  // IMPORTANT: noInitialRun prevents Emscripten from auto-running main() which triggers scanf/prompt.
  modulePromise = window.createMyProgModule({
    locateFile: (file) => {
      if (file.endsWith('.wasm')) return '/myprog.wasm';
      return file;
    },
    noInitialRun: true
  });

  return modulePromise;
}

export async function modexpClient(a, b, n) {
  const Module = await loadWasmClient();
  // call exported function
  const fn = Module._modexp ?? Module.modexp;
  if (!fn) throw new Error('modexp not exported in wasm module');
  return fn(BigInt(a), BigInt(b), BigInt(n));
}
