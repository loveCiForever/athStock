// athStock/server/src/middlewares/auth.js

import jwt from "jsonwebtoken";
import UserModel from "../models/user.model.js";

export async function requireAuth(req, res, next) {
  // console.log(`[requireAuth] req: ${}`);
  const auth = req.headers.authorization?.split(" ");
  if (auth?.[0] !== "Bearer" || !auth[1]) {
    return res.status(401).json({ message: "Missing token" });
  }
  try {
    const payload = jwt.verify(auth[1], process.env.SECRET_ACCESS_KEY);
    req.user = await UserModel.findById(payload.id);
    if (!req.user) throw new Error("No such user");
    next();
  } catch (err) {
    res.status(401).json({ message: "Invalid token" });
  }
}
