"use client";

import { useEffect, useState } from "react";

export default function Home() {
  const [wasmModule, setWasmModule] = useState(null);
  const [loading, setLoading] = useState(true);

  const [g, setG] = useState("");
  const [p, setP] = useState("");
  const [a, setA] = useState("");
  const [x, setX] = useState(null);
  const [serverResult, setServerResult] = useState(null);

  useEffect(() => {
    let cancelled = false;

    const loadWasm = async () => {
      try {
        // If the module is already loaded (Fast Refresh), reuse it
        if (window.Module) {
          setWasmModule(window.Module);
        } else {
          // Load the WASM script
          if (!document.querySelector('script[data-wasm="modexp"]')) {
            const script = document.createElement("script");
            script.src = "/modexp.js";
            script.setAttribute("data-wasm", "modexp");
            document.body.appendChild(script);

            // Wait until window.Module exists
            await new Promise((resolve, reject) => {
              let attempts = 0;
              const interval = setInterval(() => {
                if (window.Module) {
                  clearInterval(interval);
                  resolve();
                }
                attempts++;
                if (attempts > 200) {
                  clearInterval(interval);
                  reject(new Error("WASM Module not found after 10s"));
                }
              }, 50);
            });
          }

          setWasmModule(window.Module);
        }
      } catch (err) {
        console.error("WASM load error:", err);
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    loadWasm();
    return () => { cancelled = true; };
  }, []);

  const computeFrontend = async () => {
    if (!wasmModule) return;

    // Use '_modexp' as exported in C
    const modexp = wasmModule.cwrap("_modexp", "number", [
      "number",
      "number",
      "number",
    ]);

    const gNum = Number(g);
    const pNum = Number(p);
    const aNum = Number(a);

    // Compute g^a mod p safely (32-bit)
    const xa = modexp(gNum, aNum, pNum);
    setX(xa);

    // Send result to server
    const res = await fetch("/api/dh", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ g: gNum, p: pNum, x: xa }),
    });

    const data = await res.json();
    setServerResult(data);
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>Diffie Hellman (Frontend + WASM + Backend)</h2>

      {loading ? (
        <p>Loading WASM module...</p>
      ) : (
        <>
          <input
            placeholder="Enter g"
            value={g}
            onChange={(e) => setG(e.target.value)}
          />
          <br />
          <input
            placeholder="Enter p"
            value={p}
            onChange={(e) => setP(e.target.value)}
          />
          <br />
          <input
            placeholder="Enter secret a"
            value={a}
            onChange={(e) => setA(e.target.value)}
          />
          <br />
          <button onClick={computeFrontend} disabled={!wasmModule}>
            Compute
          </button>

          <h3>Frontend Output (x = g^a mod p): {x}</h3>

          {serverResult && (
            <>
              <h3>Server y value: {serverResult.y}</h3>
              <h3>Shared Key K: {serverResult.K}</h3>
            </>
          )}
        </>
      )}
    </div>
  );
}














