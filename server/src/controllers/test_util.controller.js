// test.util.controller.js

import { hashPassword } from "../utils/function.util.js";

const test_hash_password = async (req, res) => {
  const { password } = req.body;
  // console.log("Received password:", password);
  try {
    const hashedPassword = await Promise.all([hashPassword(password)]);
    console.log("Hashed password:", hashedPassword);
    return res.formatter.ok({ hashedPassword });
  } catch (error) {
    console.log("---> test_util: ", error);
    return res.formatter.error("An error occurred while hashing the password.");
  }
};

export { test_hash_password };
