// lib/wasmServer.js
import fs from "fs";
import path from "path";
import vm from "vm";

let cachedFactory = null;
let cachedModuleInstance = null;

function findExportedFn(exportsObj) {
  const candidates = ["_modexp", "modexp", "b", "c", "d", "e", "f"];
  for (const n of candidates) if (exportsObj[n] !== undefined) return exportsObj[n];
  for (const k of Object.keys(exportsObj)) if (typeof exportsObj[k] === "function") return exportsObj[k];
  return null;
}

async function loadFactoryFromJs(jsPath) {
  const full = path.resolve(jsPath);
  const code = await fs.promises.readFile(full, "utf8");

  const sandbox = { Module: {}, window: {}, global: {}, self: {}, console };
  vm.createContext(sandbox);

  // Run the JS glue in sandbox. For MODULARIZE=1 build the file defines createMyProgModule.
  const script = new vm.Script(code, { filename: full });
  script.runInContext(sandbox);

  const factory =
    sandbox.createMyProgModule ??
    sandbox.Module?.createMyProgModule ??
    sandbox.window?.createMyProgModule ??
    sandbox.global?.createMyProgModule ??
    sandbox.self?.createMyProgModule;

  if (typeof factory !== "function") {
    throw new Error("createMyProgModule factory not found in myprog.js");
  }
  return factory;
}

async function instantiateModuleWithBytes(factory, wasmAbsolutePath) {
  // read wasm bytes synchronously (safe on server startup)
  const wasmBytes = fs.readFileSync(wasmAbsolutePath);

  // call factory with an instantiateWasm override so the glue uses our bytes
  const ModuleInstance = await factory({
    locateFile: (f) => wasmAbsolutePath, // not used because we override instantiateWasm
    noInitialRun: true,
    instantiateWasm(imports, receiveInstanceCallback) {
      // instantiate the module from bytes using Node's WebAssembly.instantiate
      return WebAssembly.instantiate(wasmBytes, imports).then((res) => {
        receiveInstanceCallback(res.instance);
        return res.instance.exports;
      });
    }
  });

  return ModuleInstance;
}

export async function loadWasmServer() {
  if (cachedModuleInstance) return cachedModuleInstance;

  const jsPath = path.join(process.cwd(), "public", "myprog.js");
  const wasmPath = path.join(process.cwd(), "public", "myprog.wasm");

  if (!fs.existsSync(jsPath) || !fs.existsSync(wasmPath)) {
    throw new Error("public/myprog.js or public/myprog.wasm not found. Ensure files are present.");
  }

  if (!cachedFactory) {
    cachedFactory = await loadFactoryFromJs(jsPath);
  }

  cachedModuleInstance = await instantiateModuleWithBytes(cachedFactory, wasmPath);
  return cachedModuleInstance;
}

export async function modexpServer(a, b, n) {
  const Module = await loadWasmServer();
  const fn = findExportedFn(Module);
  if (!fn) {
    throw new Error("No modexp-like export found on server Module. Available: " + Object.keys(Module).join(", "));
  }
  const res = fn(BigInt(a), BigInt(b), BigInt(n));
  return BigInt(res);
}
