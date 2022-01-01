import jwt from "jsonwebtoken";
import dotenv from "dotenv/config"

export const jwtAuth = async (user) => {
  const token = await generateJWTToken({ _id: user._id });
  return token;
};

const generateJWTToken = (payload) =>
  new Promise((resolve, reject) => {
    jwt.sign(
      payload,
      process.env.AUTH_ACCESS_SECRET,
      { expiresIn: "30m" },
      (err, token) => {
        if (err) reject(err);
        else resolve(token);
      }
    );
  });
