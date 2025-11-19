Diffie-Hellman lab project (PDF-compliant)

Files:
- server.js            (Node server: tries emscripten glue, raw wasm, then JS fallback)
- public/index.html    (Client UI per question paper)
- public/myprog_fallback.js (JS fallback so you can run without emscripten)
- myProg.c             (original C source - unchanged)
- build_wasm_and_place.ps1 (PowerShell script to download emsdk and compile)
- package.json

How to run (quick):
1. Install Node.js (14+)
2. From project root:
   npm install
   npm start
3. Open http://localhost:8080
4. Click "Load myprog.js" then "Compute & Send"

To produce real WASM using Emscripten:
- Run PowerShell as Administrator and execute: .\build_wasm_and_place.ps1
- Or manually: run emsdk_env.bat in your emsdk folder, then run the emcc command:
  emcc myProg.c -O3 -s WASM=1 -s EXPORTED_FUNCTIONS="['_modexp']" -s EXPORTED_RUNTIME_METHODS="['ccall','cwrap']" -o public\myprog.js

Notes:
- Keep myProg.c unchanged as requested.
- The server will prefer the compiled Emscripten glue when present; otherwise it will use the JS fallback.
