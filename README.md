# Exploring Post-Quantum Cryptography with liboqs

## Objective

The goal of this assignment is to:

1. Introduce students to the **liboqs** library.
2. Compare classical cryptographic algorithms (RSA, ECC) with post-quantum algorithms (Kyber, Dilithium, Falcon, etc.).
3. Gain hands-on experience with **Key Encapsulation Mechanisms (KEMs)** and **Digital Signature Schemes (SIGs)** in liboqs.
4. Understand the integration challenges of post-quantum cryptography in real-world systems.

---

## Setup Instructions

### Install Dependencies

```bash
sudo apt update
sudo apt install -y git cmake build-essential libssl-dev pkg-config
```

### Clone & Build liboqs

```bash
git clone --branch main https://github.com/open-quantum-safe/liboqs.git
cd liboqs
mkdir build && cd build
cmake -DCMAKE_BUILD_TYPE=Release ..
make -j$(nproc)
sudo make install
```

If the linker cannot find `-loqs`, run:

```bash
sudo ldconfig
```

---

## Compilation & Running Programs

Use the following commands to compile and run any of your `.c` programs:

```bash
gcc file_name.c -o file_name -loqs -lcrypto -lssl
./file_name
```

If libraries are installed in non-standard paths, you can specify them explicitly:

```bash
gcc file_name.c -o file_name -I/usr/local/include -L/usr/local/lib -loqs -lcrypto -lssl
```

---

## Tasks Overview

### **Task 1: Getting Started**

* List all available KEM and SIG algorithms supported in your build of liboqs.
* Print:

  * Algorithm name
  * Public key length
  * Secret key length
  * Ciphertext length (for KEMs)

**Hint:** Use `OQS_KEM_alg_count()`, `OQS_KEM_alg_identifier()`, `OQS_SIG_alg_count()`.

---

### **Task 2: Key Encapsulation (KEM)**

1. Alice generates a keypair.
2. Bob uses Alice’s public key to encapsulate a shared secret.
3. Alice decapsulates the ciphertext and recovers the same shared secret.
4. Print both secrets and confirm equality.

**Extend the program** to measure:

* Key generation time
* Encapsulation time
* Decapsulation time

---

### **Task 3: Digital Signatures (SIG)**

1. Generate a keypair.
2. Sign a message (e.g., “Post-Quantum Cryptography is the future”).
3. Verify the signature.
4. Print success/failure.

**Compare** key/signature sizes with RSA-2048 or ECDSA P-256 using OpenSSL or Crypto++.

---

### **Task 4: Comparative Study**

Compare PQC schemes with classical algorithms:

* Key sizes
* Signature/ciphertext sizes
* Execution times

**Write a 2–3 page report** discussing:

* Which PQC algorithm seems practical for real-world deployment.
* Trade-offs between security, performance, and key sizes.
* How hybrid schemes (PQC + classical) could be useful.

---

## Report Template

```markdown
# Lab 2 Report — Exploring Post-Quantum Cryptography (liboqs)

## Student: <Your Name>
## Date: <Date>

### 1. Introduction
Briefly describe the motivation for post-quantum cryptography.

### 2. Setup & Tools
- liboqs version used
- Platform (e.g., Ubuntu 22.04)
- OpenSSL version (if compared)

### 3. Task 1 — Available algorithms
Summarize the KEMs and SIGs found, noting which were enabled.

### 4. Task 2 — KEM Demo
Summarize Kyber512 (or chosen algorithm) results:
- Key sizes
- Ciphertext sizes
- Timing (keygen, encaps, decaps)

### 5. Task 3 — Signature Demo
Summarize Dilithium2 (or chosen algorithm) results:
- Key and signature sizes
- Verification results
- Comparison to RSA/ECDSA

### 6. Comparative Study
Provide a table comparing classical vs PQC algorithms.
Discuss practical feasibility and trade-offs.

### 7. Conclusion
Key takeaways and observations.

### 8. References
- liboqs documentation
- NIST PQC standards
```

---

## Troubleshooting

* Ensure `liboqs` is properly linked (`-loqs`).
* If `OQS_KEM_alg_is_enabled` or `OQS_SIG_alg_is_enabled` returns false, rebuild liboqs enabling those algorithms.
* Use `sudo ldconfig` after `make install` to refresh linker paths.

---

**End of README**
