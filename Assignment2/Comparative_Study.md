# **Comparative Study: Post-Quantum Cryptography (PQC) vs Classical Algorithms**

## Comparing PQC Schemes with Classical Algorithms : 

<ins>Key Size:</ins> The amount of data (in bytes or bits) required to represent the public key and private key of a cryptographic algorithm.

<ins>Signature/ciphertext sizes:</ins> For digital signatures, it’s the amount of data attached to a message to prove authenticity.<br />
For encryption (KEMs), the ciphertext size is the data sent to convey the encrypted secret.

<ins>Execution Time:</ins>The time or number of CPU cycles required for key generation, encryption/decryption, or signing/verification.

| **Parameter** | **Classical Algorithms** | **Post-Quantum Cryptography (PQC)** |
|----------------|--------------------------|-------------------------------------|
| **Key Size** | RSA: 2048 bits<br>ECC: 256 bits | Lattice-based: Several KB<br>Code-based: Hundreds of KB |
| **Ciphertext / Signature Size** | Usually a few hundred bytes | Often several KB to tens of KB |
| **Execution Time** | Faster on current CPUs | Slower (depends on PQC scheme) |

## Report :


### 1. Introduction
Quantum computing represents a significant paradigm shift in computational power, capable of solving certain mathematical problems exponentially faster than classical computers. Classical cryptographic algorithms such as RSA and ECC rely on the hardness of integer factorization and discrete logarithms. Quantum algorithms, most notably Shor's algorithm, can solve these efficiently, rendering current public-key systems vulnerable.

Post-Quantum Cryptography (PQC) aims to develop algorithms that remain secure against both classical and quantum attacks. This ensures long-term confidentiality, integrity, and authentication of digital communications, financial transactions, and sensitive data.  

This report provides a comparative analysis of classical cryptography and PQC algorithms, focusing on practical deployment, key sizes, performance, and the role of hybrid cryptographic schemes in real-world applications.

---

### 2. Practical PQC Algorithms for Real-World Deployment

#### 2.1 CRYSTALS-Kyber
- **Type:** Key Encapsulation / Encryption (KEM)  
- **Mathematical Basis:** Module-LWE lattice problem  
- **Key Features:**  
  - Efficient key generation and encryption/decryption  
  - Provably secure under lattice-based assumptions  
  - Selected by NIST (2022) as the standard PQC KEM  
- **Applications:** Secure key exchange, TLS 1.3 integration, secure messaging  

Kyber’s lattice-based design provides strong security while maintaining reasonable computational requirements. It has been adopted experimentally in hybrid key exchanges by major tech companies to evaluate PQC readiness.

#### 2.2 CRYSTALS-Dilithium
- **Type:** Digital Signature Scheme  
- **Mathematical Basis:** Module-LWE and Module-SIS lattice problems  
- **Key Features:**  
  - Fast signature generation and verification  
  - Moderate key and signature sizes compared to other PQC signature schemes  
  - Selected by NIST as the standard PQC signature algorithm  
- **Applications:** Message authentication, software signing, secure communication  

Dilithium’s lattice-based approach ensures that signatures remain secure even against quantum adversaries while being computationally efficient for modern systems.

**Observation:** Lattice-based schemes like Kyber and Dilithium are currently the most practical for real-world deployment due to their combination of security, performance, and NIST standardization.

---

## 3. Trade-Offs: Security, Performance, and Key Sizes

| **Parameter** | **Classical Algorithms (RSA/ECC)** | **Post-Quantum Cryptography (Kyber/Dilithium)** | **Trade-Off Insight** |
|---------------|----------------------------------|-----------------------------------------------|---------------------|
| **Security Basis** | Integer factorization, discrete logarithm | Lattice problems (Module-LWE/SIS) | PQC provides quantum-resistant security, unlike classical algorithms |
| **Key Size** | RSA: 2048 bits<br>ECC: 256 bits | Kyber/Dilithium: several KB | Larger keys increase storage and transmission requirements |
| **Performance** | Fast on classical CPUs | Slightly slower; optimized implementations available | Heavier computations slightly reduce speed, but remain practical |

**Analysis:**  
Lattice-based PQC schemes like Kyber and Dilithium strike a **practical balance** among security, performance, and key sizes. While PQC requires larger keys and slightly more computational effort than classical algorithms, the **quantum-resistant security** they provide makes these trade-offs worthwhile. This is especially important for systems that need long-term data protection against future quantum attacks.


---

## 4. Hybrid Cryptographic Schemes

### 4.1 Concept
Hybrid schemes combine classical algorithms (e.g., RSA or ECC) with PQC algorithms (e.g., Kyber) in a single protocol. Both keys contribute to the final shared secret. This ensures security even if one algorithm is later compromised.

### 4.2 Benefits
- **Smooth Transition:** Allows organizations to adopt PQC gradually without breaking compatibility with existing infrastructure.  
- **Backward Compatibility:** Works with classical systems while testing PQC in production.  
- **Resilient Security:** Even if classical or PQC is broken individually, the other provides security.  

### 4.3 Real-World Example
- **TLS hybrid key exchange:** Combines X25519 (classical ECC) with Kyber-768 (lattice-based PQC)  
- Minimal performance impact with fully quantum-resistant key derivation  
- Tested by companies like Google and Cloudflare for early PQC adoption

Hybrid schemes are especially important during the transition period when quantum computers capable of breaking classical algorithms may not yet exist, but early adoption of PQC is critical for future-proof security.

---

## 5. Practical Considerations for Deployment
- **Key Management:** Larger key and ciphertext sizes require efficient storage and transmission strategies.  
- **Performance:** PQC adds computational overhead, but careful implementation (vectorization, parallelism) reduces latency.  
- **Protocol Integration:** Hybrid adoption allows seamless integration with TLS, VPNs, and secure messaging platforms.  
- **Regulatory Compliance:** Organizations should plan PQC adoption in line with NIST standards and industry best practices.

---

## 6. Conclusion
Post-Quantum Cryptography is essential to protect digital communications from future quantum threats. Among NIST-selected candidates, **lattice-based schemes** such as **Kyber** (encryption) and **Dilithium** (digital signatures) provide the best balance of security, efficiency, and practicality.  

Hybrid cryptographic schemes, which combine classical and PQC algorithms, allow organizations to transition smoothly, maintaining security and backward compatibility. Early adoption of lattice-based PQC and hybrid protocols will ensure resilient infrastructure as quantum computing becomes a practical reality.




