# Lab Test – Diffie–Hellman (WASM + Next.js)

## Platform Used
- macOS

## Software / Tools Used
- Node.js
- Next.js 
- Emscripten (emcc)
- WebAssembly (WASM)
- C Programming (myProg.c compiled to WASM)
- Curl (API Testing)

---

## How to Run the Project

### 1. Install Dependencies
```bash
npm install
```
### 2. WASM Compilation Command
```bash
emcc myProg.c -O3 \
  -s WASM_BIGINT=1 \
  -s EXPORTED_FUNCTIONS='["_modexp"]' \
  -s EXPORTED_RUNTIME_METHODS='["cwrap"]' \
  -s NO_EXIT_RUNTIME=1 \
  -s MODULARIZE=1 \
  -s 'EXPORT_NAME="createMyProgModule"' \
  -o public/myprog.js
```

### 3. API Testing Command 
```bash 
curl -X POST http://localhost:3001/api/dh \
  -H "Content-Type: application/json" \
  -d '{"g":"5","p":"23","x":"8"}'
```
### 4. Start Development Server 
```bash
npm run dev
```
then open in browser http://localhost:3001

## Command to Calculate the MD5 digest during lab test
```bash
md5sum Lab_Test_MNS2025xxx.zip
```
