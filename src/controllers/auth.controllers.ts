import { Request, Response } from "express";
import { CustomError } from "../middlewares/errorHandler.middleware";
import { User } from "../models/user.models";

// registration
export const registerUser = async (req: Request, res: Response) => {
  try {
    const { first_name, last_name, email, phone_number, role } = req.body;
    const user = await User.create({
      first_name,
      last_name,
      email,
      phone_number,
      role,
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

// forget password

// change password
