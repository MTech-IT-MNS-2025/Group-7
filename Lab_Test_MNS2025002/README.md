# Lab Test – Diffie–Hellman (WASM + Next.js)

## Platform Used
- Windows

## Software / Tools Used
- Node.js
- NPM(Node Package Manager)
- Emscripten (emcc)
- VS Code(code editor)
- HTTP-Server (via npx) for frontend hosting
- Express.js (server-side web framework)

---

## How to Run the Project

### 1. Install Dependencies
```bash
npm install
```
### 2. WASM Compilation Command
```bash
emcc myProg.c -O3 -s WASM=1 -s EXPORTED_FUNCTIONS='["_modexp"]' -s EXPORTED_RUNTIME_METHODS='["cwrap","ccall"]' -s MODULARIZE=1 -s EXPORT_NAME='createMyProgModule' -o frontend/myProg.js

```

### 3. Start Development Server 
```bash
npm run dev
```
then open in browser http://localhost:3000

## Command to Calculate the MD5 digest during lab test
```bash
md5sum next-wasm-dh.zip
```
