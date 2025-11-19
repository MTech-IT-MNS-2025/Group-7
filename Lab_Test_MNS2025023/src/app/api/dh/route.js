// src/app/api/dh/route.js
import { NextResponse } from 'next/server';
import { modexpServer } from '../../../../lib/wasmServer';

export async function POST(req) {
  try {
    const body = await req.json();
    const g = BigInt(body.g);
    const p = BigInt(body.p);
    const x = BigInt(body.x);

    // generate random b in [2, p-2] (demo; not cryptographically uniform)
    const maxSmall = 1000000; // randomness entropy; ok for lab
    const rnd = BigInt(Math.floor(Math.random() * maxSmall));
    const b = 2n + (rnd % (p - 3n + 1n));

    // compute y = g^b mod p
    const y = await modexpServer(g, b, p);

    // compute K = x^b mod p (shared key)
    const K = await modexpServer(x, b, p);

    return NextResponse.json({ K: K.toString(), y: y.toString() });
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}
