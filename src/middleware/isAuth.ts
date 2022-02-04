import { Request } from "express";
import jwt from "jsonwebtoken";

export const isAuth = async (req: Request) => {
  const authHeader = req.get("Authorization");

  if (!authHeader) {
    return { isAuth: false };
  }

  const token = authHeader.split(" ")[1];

  if (!token || token === "") {
    return { isAuth: false };
  }

  interface DecodedToken extends jwt.JwtPayload {
    account: { _id: string };
    user: { _id: string; role: number };
  }

  let decodedToken: DecodedToken;

  if (!process.env.JWT_ENCRYPTION_KEY) {
    return { isAuth: false };
  }

  try {
    decodedToken = jwt.verify(
      token,
      process.env.JWT_ENCRYPTION_KEY
    ) as DecodedToken;
  } catch (err) {
    console.log(err);
    return { isAuth: false };
  }

  if (!decodedToken) {
    return { isAuth: false };
  }

  return {
    token: decodedToken,
    isAuth: true,
  };
};
