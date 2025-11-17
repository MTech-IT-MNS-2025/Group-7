# RC4 WASM App — Next.js + WebAssembly

A lightweight, high-performance **RC4 Encryption/Decryption** web application built with **Next.js**, **React**, and **WebAssembly (WASM)**. The RC4 algorithm is implemented in C and compiled to WebAssembly using **Emscripten**, allowing fast client-side encryption/decryption.

---

## Objective

The goal of this project is to demonstrate how a cryptographic algorithm written in C can be compiled into WebAssembly (WASM) and integrated with a modern JavaScript frontend using Next.js.  
Users will be able to perform RC4 encryption and decryption directly in the browser, leveraging the performance of native C code while interacting through a clean and responsive web interface.

---

## Learning Outcomes

## Learning Outcomes

1. Compiled C code to WebAssembly (WASM) and integrated it into a Next.js frontend.
2. Exposed native C functions to JavaScript using Emscripten.
3. Implemented RC4 encryption and decryption working in the browser.
4. Managed memory allocation and string conversions between JavaScript and WASM.
5. Built a functional interface in Next.js to test and interact with the WASM module in real time.

---

## Tools & Technologies

- Frontend & Backend: Node.js, Next.js
- WebAssembly: Emscripten (C → WASM compilation)
- Programming Language: C (RC4 algorithm)
- Memory & String Handling: JavaScript WASM APIs
- Styling: CSS (inline styles for simplicity)

---

## Prerequisites

- Node.js 18 or higher
- npm (Node Package Manager)
- A browser (Chrome, Firefox, Edge, etc.)

> ⚠ Emscripten is **only required** if you plan to modify or recompile the RC4 C code.

---

## Setup & Run

```bash
# 1) Install dependencies
npm install

# 2) Start the development server
npm run dev
# Open http://localhost:3000 in your browser

# 3) Use the app
# Enter text and a key in the input fields.
# Click "Encrypt" to get the encrypted text (Base64 format).
# Paste the Base64 encrypted text in the input and click "Decrypt" to get the original text.

```

## Architecture

```
Assignment-4

rc4-wasm-app
│
├── 📄 README.md              # Project overview and instructions
├── 📄 Contributors.txt       # Project contributors
├── 📄 package.json           # Node.js project metadata & scripts
├── 📄 next.config.js         # Next.js configuration
├── 📄 .gitignore             # Files to ignore in git
├── 📄 .env.local.example     # Example environment variables
│
├── 📁 pages/
│   ├── index.js              # Main page: encryption/decryption UI
│   └── _app.js               # App wrapper (Next.js)
│
├── 📁 public/
│   └── wasm/
│       ├── rc4.js            # WASM JS wrapper
│       └── rc4.wasm          # Compiled RC4 WebAssembly file
│
└── 📁 styles/
    └── globals.css           # App styling

```

## Screenshots
