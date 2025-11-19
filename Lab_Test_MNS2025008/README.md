
# Lab Test – Diffie–Hellman (WASM + Next.js)

## Platform Used
- Windows 10

## Software / Tools Used
- Node.js
- Next.js
- React
- Emscripten (emcc)
- WebAssembly (WASM)
- C Programming 


---

## How to Run the Project

### 1. Install Dependencies
```bash
npm install
```
### 2. WASM Compilation Command
```bash
emcc modeexp.c -o modeexp.js \
  -s EXPORTED_FUNCTIONS='["_modexp"]' \
  -s EXPORTED_RUNTIME_METHODS='["cwrap"]' \
  -s MODULARIZE=1 \
  -s 'EXPORT_NAME="Module"' 
```

### 3. Start Development Server 
```bash
npm run dev
```
then open in browser http://localhost:3000

## Command to Calculate the MD5 digest during lab test
```bash
md5sum cryptolab.zip
```
