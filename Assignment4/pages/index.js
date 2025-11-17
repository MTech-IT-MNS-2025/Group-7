import { useEffect, useState } from "react";

export default function Home() {
  const [Module, setModule] = useState(null);
  const [text, setText] = useState("");
  const [key, setKey] = useState("");
  const [result, setResult] = useState("");

  useEffect(() => {
    fetch("/wasm/rc4.js")
      .then((res) => res.text())
      .then((jsCode) => {
        const script = document.createElement("script");
        script.text = jsCode;
        document.body.appendChild(script);
        window.RC4Module().then((mod) => setModule(mod));
      });
  }, []);

  // Convert WASM bytes to Base64
  const bytesToBase64 = (ptr, len) => {
    const bytes = new Uint8Array(Module.HEAPU8.buffer, ptr, len);
    let binary = "";
    for (let i = 0; i < bytes.length; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    return btoa(binary);
  };

  // Convert Base64 to WASM bytes
  const base64ToBytes = (base64, ptr) => {
    const binary = atob(base64);
    const bytes = new Uint8Array(Module.HEAPU8.buffer, ptr, binary.length);
    for (let i = 0; i < binary.length; i++) {
      bytes[i] = binary.charCodeAt(i);
    }
    return binary.length;
  };

  const encryptText = () => {
    if (!Module) return alert("WASM not loaded yet");
    if (!text || !key) return alert("Enter both text and key");

    const keyPtr = Module._malloc(key.length);
    Module.stringToUTF8(key, keyPtr, key.length + 1);
    Module._rc4_init(keyPtr, key.length);

    const dataPtr = Module._malloc(text.length);
    Module.stringToUTF8(text, dataPtr, text.length + 1);

    Module._rc4_crypt(dataPtr, text.length);

    const encryptedBase64 = bytesToBase64(dataPtr, text.length);
    setResult(encryptedBase64);

    Module._free(keyPtr);
    Module._free(dataPtr);
  };

  const decryptText = () => {
    if (!Module) return alert("WASM not loaded yet");
    if (!text || !key) return alert("Enter both Base64 encrypted text and key");

    const encryptedBase64 = text;
    const keyPtr = Module._malloc(key.length);
    Module.stringToUTF8(key, keyPtr, key.length + 1);
    Module._rc4_init(keyPtr, key.length);

    // Allocate buffer of exact size
    const dataLen = atob(encryptedBase64).length;
    const dataPtr = Module._malloc(dataLen);

    // Copy Base64 bytes to WASM
    base64ToBytes(encryptedBase64, dataPtr);

    Module._rc4_crypt(dataPtr, dataLen);

    // Convert decrypted bytes back to string
    const decrypted = Module.UTF8ToString(dataPtr, dataLen + 1);
    setResult(decrypted);

    Module._free(keyPtr);
    Module._free(dataPtr);
  };

  return (
    <div style={{ padding: 40 }}>
      <h1>RC4 Encryption / Decryption (WASM)</h1>

      <div style={{ marginBottom: 20 }}>
        <input
          style={{ width: "300px", marginRight: 10 }}
          placeholder="Enter text (Encrypt) / Base64 (Decrypt)"
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
      </div>

      <div style={{ marginBottom: 20 }}>
        <input
          style={{ width: "300px", marginRight: 10 }}
          placeholder="Enter key"
          value={key}
          onChange={(e) => setKey(e.target.value)}
        />
      </div>

      <div style={{ marginBottom: 20 }}>
        <button onClick={encryptText} style={{ marginRight: 10 }}>
          Encrypt
        </button>
        <button onClick={decryptText}>Decrypt</button>
      </div>

      <div>
        <h3>Result:</h3>
        <textarea
          style={{ width: "500px", height: "150px" }}
          value={result}
          readOnly
        />
      </div>
    </div>
  );
}
