import { NextFunction, Request, Response } from "express";
import { Role } from "../types/enum.types";
import { CustomError } from "./error-handler.middleware";
import { verifyToken } from "../utils/jwt.utils";
import { User } from "../models/user.models";

export const authenticate = (role?: Role[]) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      // get token from cookie
      const access_token = req.cookies.access_token;

      // verify token
      if (!access_token) {
        throw new CustomError("Unauthorized, access denied!", 401);
      }

      //  making instance of token data
      const decodedData = verifyToken(access_token);

      //* check token expiry

      if (Date.now() > decodedData.exp * 1000) {
        // clearing cookie
        res.clearCookie("access_token", {
          secure: process.env.NODE_ENV === "development" ? false : true,
          httpOnly: true,
          sameSite: "none",
        });
        throw new CustomError("session expired access_token", 401);
      }

      const user = await User.findById(decodedData._id);

      if (!user) {
        throw new CustomError("Unauthorized, Access_token", 401);
      }

      if (role && !role.includes(decodedData.role)) {
        throw new CustomError("forbidden, Access denied", 403);
      }

      req.user = {
        _id: decodedData._id,
        email: decodedData.email,
        role: decodedData.role,
        first_name: decodedData.first_name,
        last_name: decodedData.last_name,
      };

      // role -> roles.includes(userRole)
      next();
    } catch (error) {
      next(error);
    }
  };
};
