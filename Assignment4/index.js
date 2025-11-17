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
    if (!text || !key)
      return alert("Enter both Base64 encrypted text and key");
    const encryptedBase64 = text;
    const keyPtr = Module._malloc(key.length);
    Module.stringToUTF8(key, keyPtr, key.length + 1);
    Module._rc4_init(keyPtr, key.length);
    const dataLen = atob(encryptedBase64).length;
    const dataPtr = Module._malloc(dataLen);
    base64ToBytes(encryptedBase64, dataPtr);
    Module._rc4_crypt(dataPtr, dataLen);
    const decrypted = Module.UTF8ToString(dataPtr, dataLen + 1);
    setResult(decrypted);
    Module._free(keyPtr);
    Module._free(dataPtr);
  };
  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        background: "linear-gradient(135deg, #a8c0ff, #3f2b96)",
        padding: 20,
        fontFamily: "Arial",
      }}
    >
      <div
        style={{
          background: "white",
          padding: "40px",
          borderRadius: "12px",
          boxShadow: "0px 8px 25px rgba(0,0,0,0.15)",
          width: "500px",
          textAlign: "center",
        }}
      >
        <h1 style={{ marginBottom: "30px", color: "#3f2b96" }}>
          RC4 Encryption / Decryption (WASM)
        </h1>
        <div style={{ marginBottom: 20 }}>
          <input
            style={{
              width: "100%",
              padding: "12px",
              borderRadius: "8px",
              border: "1px solid #ccc",
            }}
            placeholder="Enter text (Encrypt) / Base64 (Decrypt)"
            value={text}
            onChange={(e) => setText(e.target.value)}
          />
        </div>
        <div style={{ marginBottom: 20 }}>
          <input
            style={{
              width: "100%",
              padding: "12px",
              borderRadius: "8px",
              border: "1px solid #ccc",
            }}
            placeholder="Enter key"
            value={key}
            onChange={(e) => setKey(e.target.value)}
          />
        </div>
        <div style={{ marginBottom: 20 }}>
          <button
            onClick={encryptText}
            style={{
              padding: "10px 20px",
              marginRight: 10,
              borderRadius: "8px",
              border: "none",
              background: "#3f2b96",
              color: "white",
              cursor: "pointer",
            }}
          >
            Encrypt
          </button>
          <button
            onClick={decryptText}
            style={{
              padding: "10px 20px",
              borderRadius: "8px",
              border: "none",
              background: "#6a5acd",
              color: "white",
              cursor: "pointer",
            }}
          >
            Decrypt
          </button>
        </div>
        <h3 style={{ color: "#3f2b96" }}>Result:</h3>
        <textarea
          style={{
            width: "100%",
            height: "150px",
            padding: "12px",
            borderRadius: "8px",
            border: "1px solid #ccc",
          }}
          value={result}
          readOnly
        />
      </div>
    </div>
  );
}
