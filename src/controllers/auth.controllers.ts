import bcrypt from "bcryptjs";
import { compareHash, hashPassword } from "./../utils/bcrypt.utils";
import { Request, Response } from "express";
import { CustomError } from "../middlewares/error-handler.middleware";
import { User } from "../models/user.models";
import { asyncHandler } from "../utils/async-handler.utils";
import { IJWTPayload } from "../types/global.types";
import { generateToken } from "../utils/jwt.utils";

// registration
export const registerUser = asyncHandler(
  async (req: Request, res: Response) => {
    const { first_name, last_name, email, password, phone_number } = req.body;

    const user: any = await User.create({
      first_name,
      last_name,
      password,
      phone_number,
      email,
    });

    const hashedPassword = await hashPassword(password);

    user.password = hashedPassword;

    await user.save();

    const { password: pass, ...newUser } = user._doc;

    res.status(201).json({
      message: "registration succeeded",
      status: "success",
      success: true,
      data: newUser,
    });
  }
);

// login

export const login = asyncHandler(async (req: Request, res: Response) => {
  //access email password
  const { email, password } = req.body;

  if (!email) {
    throw new CustomError("email is required", 400);
  }

  if (!password) {
    throw new CustomError("password is required", 400);
  }
  //find user by email
  const user: any = await User.findOne({ email }).select("+password");

  if (!user) {
    throw new CustomError("Invalid credential", 400);
  }

  const isPassMatch = await compareHash(password, user.password ?? "");

  if (!isPassMatch) {
    throw new CustomError("Invalid credential", 400);
  }

  const payload: IJWTPayload = {
    _id: user._id,
    role: user.role,
    email: user.email,
    first_name: user.first_name,
    last_name: user.last_name,
  };

  const access_token = generateToken(payload);

  const { password: pass, ...loggedInUser } = user._doc;

  res.status(200).json({
    message: "get succeeded",
    status: "success",
    success: true,
    data: {
      data: loggedInUser,
      access_token,
    },
  });
});

// forget password
// export const forgetPassword = asyncHandler(
//   async (req: Request, res: Response) => {
//     const { email, password } = req.body;
//

//     if (!email) {
//       throw new CustomError("email is required", 400);
//     }

//     const user = await User.findOne({ email });

//     if (!user) {
//       throw new CustomError("user is not found!", 400);
//     }

//     user.updateOne({ _id: user._id }, { $set: { password: password } });
//   }
// );

//* change password

export const changePassword = asyncHandler(
  async (req: Request, res: Response) => {
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

    // const isPasswordMatch = user.password === old_password;
    // const isPasswordMatch = await bcrypt.compare(old_password, user.password);
    const isPasswordMatch = compareHash(old_password, user.password);

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
  }
);
