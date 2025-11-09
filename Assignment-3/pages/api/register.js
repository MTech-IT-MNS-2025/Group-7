import bcrypt from "bcryptjs";
import { dbConnect } from "../../lib/db";
import User from "../../models/User";

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end();

  await dbConnect();
  const { username, password } = req.body;

  if (!username || !password)
    return res.status(400).json({ error: "Username and password are required" });

  const existing = await User.findOne({ username });
  if (existing)
    return res.status(400).json({ error: "Username already exists" });

  const hashed = await bcrypt.hash(password, 10);
  await User.create({ username, password: hashed });

  res.status(201).json({ message: "Registered successfully" });
}
