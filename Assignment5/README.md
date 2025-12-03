# Post-Quantum Secure Private Messaging — Next.js + Socket.io + MongoDB + liboqs

A secure, one-to-one private chat application built with **Next.js** (pages + API routes), **Socket.io** for real-time communication, and **MongoDB Atlas** for persistence. This version introduces **Post-Quantum Cryptography (PQC)** using the `liboqs` library to secure messages against potential threats from quantum computers.

## Objective
Design and implement a quantum-safe private messaging application. Messages are encrypted end-to-end using a hybrid approach:
1.  **Key Encapsulation:** NIST PQC Winner **ML-KEM-768 (Kyber)** is used to securely exchange a symmetric key.
2.  **Message Encryption:** **AES-256-GCM** is used to encrypt the actual message content using the exchanged key.

## Learning Outcomes
1.  Integrate WebAssembly (WASM) libraries (`liboqs`) into a Next.js application.
2.  Implement Post-Quantum Cryptographic algorithms (Kyber/ML-KEM) in a browser environment.
3.  Design a secure key exchange protocol preventing server-side access to plaintext messages.
4.  Manage cryptographic keys (Public/Private) and secure storage on the client side.
5.  Persist encrypted data in MongoDB and decrypt it on-the-fly in the user's browser.

## Tools & Technologies
-   **Frontend & Backend:** Node.js, Next.js
-   **Realtime:** Socket.io
-   **Database:** MongoDB (+ Mongoose)
-   **Cryptography:**
    -   `liboqs` (Open Quantum Safe) compiled to WebAssembly.
    -   `ML-KEM-768` (Kyber) for Key Encapsulation.
    -   `AES-256-GCM` (Web Crypto API) for Symmetric Encryption.

---

## Prerequisites
-   Node.js 18+
-   npm
-   MongoDB (local or Atlas) connection URI
-   **Browser with WebAssembly support** (Chrome, Firefox, Edge, Safari)


## Setup & Run
```bash
# 1) Copy env
cp .env.local.example .env.local
# Edit .env.local and set MONGODB_URI

# 2) Install
npm install

# 3) Dev server
npm run dev
# Open http://localhost:3000

# 4) Test the chat
# Open two windows, login with two different usernames.
```

## How to Test the Secure Flow

### 1. Register User A
- Visit /register
- Browser generates a Kyber quantum keypair
- It downloads UserA_SECRET.txt
- Save this private key file safely

### 2. Register User B
- Open an Incognito Window
- Register again
- Save UserB_SECRET.txt

### 3. Login & Chat
- Login with username
- App asks for Secret Key
- Paste your secret key file content
- Start chatting with User B
- Server only receives encrypted ciphertext blobs

## Project Structure
```
Post-Quantum Secure Private Messaging
│
├── lib/
│   ├── crypto.js                # PQC + WASM crypto operations
│   └── db.js                    # Database connection helper
│
├── models/
│   ├── Message.js               # Encrypted message schema
│   └── User.js                  # User schema (public key stored)
│
├── node_modules/                # Dependencies (auto-generated)
│
├── pages/
│   ├── api/
│   │   ├── user/
│   │   │   └── [username].js
│   │   ├── login.js  
│   │   ├── messages.js          # Save / fetch encrypted messages
│   │   ├── register.js          # Register user + store public key
│   │   └── socketio.js          # Socket.io server handler
│   │
│   ├── _app.js                  # Next.js wrapper
│   ├── chat.js                  # Chat UI + real-time decrypt
│   ├── index.js                 # Homepage / landing
│   └── register.js              # Frontend key generation page
│
├── public/
│   ├── liboqs.js                # WASM loader (Emscripten)
│   └── liboqs.wasm              # PQC WebAssembly binary
│
├── styles/
│   └── globals.css              # Global styling
│
├── .env.local                   # Environment variables
├── .env.local.example           # Example env file
│
├── next.config.js               # Next.js configuration
├── package-lock.json
├── package.json
└── README.md

```

## Screenshots
<img width="774" height="505" alt="Screenshot 2025-12-01 at 11 25 19 PM" src="https://github.com/user-attachments/assets/dd5e6079-fdd1-4322-b12d-b6b234dce3f7" />
<img width="799" height="554" alt="Screenshot 2025-12-01 at 11 26 58 PM" src="https://github.com/user-attachments/assets/c13b1755-c51c-4d85-b03e-f48b44e73fc7" />
<img width="794" height="590" alt="Screenshot 2025-12-01 at 11 26 32 PM" src="https://github.com/user-attachments/assets/b64103f2-f8ce-4baa-831d-bc628ef2a61d" />
<img width="740" height="576" alt="Screenshot 2025-12-01 at 11 27 46 PM" src="https://github.com/user-attachments/assets/4f7d7067-8509-4c78-bbac-49b182475cc3" />

<img width="776" height="580" alt="Screenshot 2025-12-01 at 11 28 05 PM" src="https://github.com/user-attachments/assets/06e33645-6c48-401b-956a-5a28a43dddd9" />

## How to Generate the 'liboqs.js' and 'liboqs.wasm' files from liboqs C libraray using Emscripten 

Note: The above mentioned two files are already generated and kept inside the /public diractory. But, if you want to generate these from the scratch then follow the steps mentioned below:-

### Step-1: Set up the Emscripten SDK (emsdk) and cmake on your terminal 

1. Install CMake (build system tools)
   
    ``` brew install cmake ninja ```

2. Download the Emscripten SDK (emsdk)
   ```bash
    git clone https://github.com/emscripten-core/emsdk.git
    cd emsdk
    ```

3. Install and activate the latest version of the compiler
   ```bash
    ./emsdk install latest
    ./emsdk activate latest
    ```

4. Activate the environment variables (adds 'emcc' to the terminal PATH)

    ``` source ./emsdk_env.sh ```


### Step-2: Compile liboqs as a static library  


###  Step-3: Generate the final .js and .wasm files 


