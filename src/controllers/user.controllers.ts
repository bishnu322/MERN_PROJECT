import { Request, Response, NextFunction } from "express";
import { User } from "../models/user.models";
import { CustomError } from "../middlewares/errorHandler.middleware";

// get all users
export const getAll = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const user = await User.find();

    res.status(200).json({
      message: "get all data",
      status: "Success",
      success: true,
      data: user,
    });
  } catch (error) {
    next(error);
  }
};

// get by id
export const getById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;

    const user = await User.findById(id);

    if (!user) {
      throw new CustomError("User not found!", 400);
    }

    res.status(200).json({
      message: "user fetched...",
      status: "Success",
      success: true,
      data: user,
    });
  } catch (error) {
    next(error);
  }
};

// delete user

export const removeUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;

    const user = await User.findByIdAndDelete(id);

    if (!user) {
      throw new CustomError("User not found! ", 404);
    }

    res.status(200).json({
      message: "user removed successfully..",
      status: "success",
      success: true,
      data: user,
    });
  } catch (error) {
    next(error);
  }
};

// update profile
