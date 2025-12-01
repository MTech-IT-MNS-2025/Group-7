import bcrypt from "bcryptjs";
import { dbConnect } from "../../lib/db";
import User from "../../models/User";

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end();
  await dbConnect();
  
  // UPDATED: Accept publicKey
  const { username, password, publicKey } = req.body;

  if (!username || !password || !publicKey) {
    return res.status(400).json({ error: "Missing fields (username, password, publicKey)" });
  }

  if (await User.findOne({ username })) return res.status(400).json({ error: "Username taken" });

  const hashed = await bcrypt.hash(password, 10);
  await User.create({ username, password: hashed, publicKey });

  res.status(201).json({ message: "Registered" });
}
