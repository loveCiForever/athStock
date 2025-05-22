import jwt from "jsonwebtoken";

const genVerificationToken = (userId) => {
  return jwt.sign({ sub: userId }, process.env.EMAIL_VERIFICATION_SECRET, {
    expiresIn: "1d",
  });
};

/**
 * Generates a JWT token and sets it as a cookie in the response.
 *
 * @param {string} id - The user's ID.
 * @param {Object} response - The HTTP response object.
 * @returns {void}
 *
 * @example
 * await genCookieToken(userId, res);
 */
const genCookieToken = (id, response) => {
  const token = jwt.sign({ id }, process.env.SECRET_ACCESS_KEY, {
    expiresIn: "30d",
  });
  response.cookie("athStockToken", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV !== "production",
    sameSite: "strict",
    maxAge: 30 * 24 * 60 * 60 * 1000,
  });

  return token;
};
export { genVerificationToken, genCookieToken };
