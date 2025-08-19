import mongoose from "mongoose";
import { Role } from "./enum.types";

export interface IJWTPayload {
  _id: mongoose.Schema.Types.ObjectId;
  role: Role;
  email: string;
  first_name: string;
  last_name: string;
}

export interface IJWTDecodedPayload extends IJWTPayload {
  exp: number;
  iat: number;
}

export const allAdmin = [Role.ADMIN, Role.SUPER_ADMIN];
export const users = [Role.USER];
export const allAdminAndUser = [...allAdmin, ...users];
