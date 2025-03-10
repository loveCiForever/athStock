// ./server/src/middlewares/verify-jwt.middleware.js

import jwt from "jsonwebtoken";
import "dotenv/config";

const verifyJWT = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  // console.log("Authorization Header:", authHeader); // Log the header
  // console.log("Token:", token); // Log the token

  if (token == null) {
    return res.status(401).json({ error: "No access token" });
  }

  jwt.verify(token, process.env.SECRET_ACCESS_KEY, (err, user) => {
    if (err) {
      console.error("JWT error: ", err);
      return res.status(403).json({ error: "Access token is invalid" });
    }

    // console.log("Decoded user: ", user);

    req.user = user.id;
    next();
  });
};

export { verifyJWT };
