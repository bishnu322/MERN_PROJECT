import mongoose from "mongoose";
import { Role } from "./enum.types";

export interface IJWTPayload {
  _id: mongoose.Schema.Types.ObjectId;
  role: Role;
  email: string;
  first_name: string;
  last_name: string;
}
