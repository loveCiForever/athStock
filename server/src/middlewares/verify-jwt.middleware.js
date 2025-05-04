// ./server/src/middlewares/verify-jwt.middleware.js

import jwt from "jsonwebtoken";
import "dotenv/config";

const verifyJWT = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  // console.log(`[verify jwt] authHeader: ${authHeader}`);

  if (!authHeader) {
    return res.status(401).json({
      success: false,
      message: "verifyJWT error",
      error: "No token provided",
    });
  }

  const token = authHeader.split(" ")[1];

  // console.log("[VERIFY JWT] Token: ", token);
  jwt.verify(token, process.env.SECRET_ACCESS_KEY, (err, decodedPayload) => {
    if (err) {
      console.error("JWT error:", err);
      return res.status(403).json({
        success: false,
        message: "verifyJWT error",
        error: "Invalid token",
      });
    }

    // console.log("[VERIFY JWT] Decoded payload:", decodedPayload);

    req.user = decodedPayload.id;
    next();
  });
};

export { verifyJWT };
