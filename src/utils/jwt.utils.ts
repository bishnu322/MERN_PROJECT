import jwt from "jsonwebtoken";
import { IJWTPayload } from "../types/global.types";

const JWT_SECRET = process.env.JWT_SECRET ?? "";
const JWT_EXPIRE_IN = process.env.JWT_EXPIRE_IN;

export const generateToken = (payload: IJWTPayload) => {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRE_IN as any });
};
