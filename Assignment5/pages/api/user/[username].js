import { dbConnect } from "../../../lib/db";
import User from "../../../models/User";

export default async function handler(req, res) {
  await dbConnect();
  const user = await User.findOne({ username: req.query.username });
  if (!user) return res.status(404).json({ error: "Not found" });
  res.status(200).json({ publicKey: user.publicKey });
}
