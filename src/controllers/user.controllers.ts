import { Request, Response } from "express";
import { User } from "../models/user.models";
import { CustomError } from "../middlewares/error-handler.middleware";
import { asyncHandler } from "../utils/async-handler.utils";

// get all users
export const getAll = asyncHandler(async (req: Request, res: Response) => {
  const user = await User.find();

  res.status(200).json({
    message: "get all data",
    status: "Success",
    success: true,
    data: user,
  });
});

// get by id
export const getById = asyncHandler(async (req: Request, res: Response) => {
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
});

// delete user

export const removeUser = asyncHandler(async (req: Request, res: Response) => {
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
});

// update profile

// export const updateUser = asyncHandler(
//   async (req: Request, res: Response, next: NextFunction) => {
//     retunr
// );
