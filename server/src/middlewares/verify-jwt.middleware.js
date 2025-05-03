// ./server/src/middlewares/verify-jwt.middleware.js

import jwt from "jsonwebtoken";
import "dotenv/config";

const verifyJWT = (req, res, next) => {
  const Header = req.headers["authorization"];
  const user_id = Header && Header.split(" ")[1];

  // console.log("Authorization Header:", Header);
  // console.log("User id:", user_id);

  if (user_id == null) {
    return res.status(401).json({ error: "No user id" });
  }

  jwt.verify(user_id, process.env.SECRET_ACCESS_KEY, (err, user) => {
    if (err) {
      console.error("JWT error: ", err);
      return res.status(403).json({
        success: false,
        message: "verifyJWT error",
        error: "Access token is invalid",
      });
    }

    req.user = user.id;
    next();
  });
};

export { verifyJWT };
