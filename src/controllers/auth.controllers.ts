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
    next("registration error");
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
    next("login error");
  }
};

// forget password

export const forgetPassword = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { email, password } = req.body;
    const update = password;

    if (!email) {
      throw new CustomError("email is required", 400);
    }

    const user = await User.findOne({ email });

    if (!user) {
      throw new CustomError("user is not found!", 400);
    }

    user.updateOne({ _id: user._id }, { $set: { password: password } });
  } catch (error) {
    next("forget error");
  }
};

// change password

export const changePassword = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { email, old_password, new_password } = req.body;

    if (!new_password) {
      throw new CustomError("new password is not registered..", 400);
    }

    if (!old_password) {
      throw new CustomError("old password is not registered..", 400);
    }

    if (!email) {
      throw new CustomError("email is required", 400);
    }

    const user = await User.findOne({ email });

    if (!user) {
      throw new CustomError("Something went wrong!!!", 500);
    }

    const isPasswordMatch = user.password === old_password;

    if (!isPasswordMatch) {
      throw new CustomError("password does not match", 400);
    }

    user.password = new_password;

    await user.save();

    res.status(201).json({
      message: "password changed successfully",
      status: "success",
      success: true,
    });
  } catch (error) {
    next(error);
  }
};
