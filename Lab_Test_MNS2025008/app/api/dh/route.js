import fs from "fs";
import path from "path";
import { NextResponse } from "next/server";

export async function POST(req) {
  const { g, p, x } = await req.json();

  const wasmPath = path.join(process.cwd(), "public/modexp.wasm");
  const wasmCode = await fs.promises.readFile(wasmPath);

  const wasm = await WebAssembly.instantiate(wasmCode, {});
  const modexp = wasm.instance.exports.modexp;

  const b = 7; // server secret (any random small value)
  const y = modexp(Number(g), b, Number(p));
  const K = modexp(Number(x), b, Number(p));

  return NextResponse.json({ y, K });
}
