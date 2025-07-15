import { NextFunction, Request, Response } from "express";
import { CustomError } from "../middlewares/errorHandler.middleware";
import { User } from "../models/user.models";

// registration
export const registerUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { first_name, last_name, email, password, phone_number, role } =
      req.body;
    const user = await User.create({
      first_name,
      last_name,
      email,
      phone_number,
      role,
      password,
    });

    res.status(201).json({
      message: "registration succeeded",
      status: "success",
      success: true,
      data: user,
    });
  } catch (error) {
    throw new CustomError("registration error", 400);
  }
};

// login

export const login = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    //access email password
    const { email, password } = req.body;

    if (!email) {
      throw new CustomError("email is required", 400);
    }

    if (!password) {
      throw new CustomError("password is required", 400);
    }
    //find user by email
    const user = await User.findOne({ email });

    if (!user) {
      throw new CustomError("Invalid credential", 400);
    }

    //user.password ===password
    const isPassMatch = user.password === password;

    if (!isPassMatch) {
      throw new CustomError("Invalid credential", 400);
    }

    res.status(200).json({
      message: "get succeeded",
      status: "success",
      success: true,
      data: user,
    });
  } catch (error) {
    next(error);
  }
};

// forget password

// change password
