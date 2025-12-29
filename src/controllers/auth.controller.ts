import { compareHash, hashPassword } from "../utils/bcrypt.utils";
import { Request, Response } from "express";
import { CustomError } from "../middlewares/error-handler.middleware";
import { User } from "../models/user.models";
import { asyncHandler } from "../utils/async-handler.utils";
import { IJWTPayload } from "../types/global.types";
import { generateToken } from "../utils/jwt.utils";
import { sendEmail } from "../utils/mailer.utils";

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

    if (!password) {
      throw new CustomError("password is required !", 400);
    }
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

  res
    .cookie("access_token", access_token, {
      secure: true,
      httpOnly: true,
      maxAge: Number(process.env.COOKIE_EXPIRY) * 24 * 60 * 60 * 1000,
      sameSite: "none",
    })
    .status(200)
    .json({
      message: "get succeeded",
      status: "success",
      success: true,
      data: {
        data: loggedInUser,
        access_token,
      },
    });
});

//*  forget password

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

    const newHashedPassword = await hashPassword(new_password);

    user.password = newHashedPassword;

    await user.save();

    res.status(201).json({
      message: "password changed successfully",
      status: "success",
      success: true,
    });
  }
);

// logout

export const logout = asyncHandler(async (req: Request, res: Response) => {
  res
    .clearCookie("access_token", {
      secure: process.env.NODE_ENV === "development" ? false : true,
      httpOnly: true,
      sameSite: process.env.NODE_ENV === "development" ? "lax" : "none",
    })
    .status(200)
    .json({
      message: "User successfully logout",
      status: "success",
      success: true,
      data: null,
    });
});

// check profile

export const profile = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.user._id;

  const user = await User.findById(userId);

  if (!user) {
    throw new CustomError("Profile found", 400);
  }

  res.status(200).json({
    message: "profile fetched",
    status: "success",
    success: true,
    data: user,
  });
});
