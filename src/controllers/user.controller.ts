import { Request, Response } from "express";
import { User } from "../models/user.models";
import { CustomError } from "../middlewares/error-handler.middleware";
import { asyncHandler } from "../utils/async-handler.utils";
import { pagination } from "../utils/pagination.utils";

// get all users
export const getAll = asyncHandler(async (req: Request, res: Response) => {
  const { current_page, per_page } = req.query;

  const page = Number(current_page) | 1;
  const limit = Number(per_page) | 10;
  const skip = (page - 1) * limit;

  const filter = {};
  const user = await User.find(filter).limit(limit).skip(skip);

  const total = await User.countDocuments(filter);

  const { total_page, next_page, pre_page, has_next_page, has_pre_page } =
    await pagination(page, limit, total);

  res.status(200).json({
    message: "get all data",
    status: "Success",
    success: true,
    data: user,
    pagination: {
      total_page,
      next_page,
      pre_page,
      has_next_page,
      has_pre_page,
    },
  });
});

// get by id
export const getById = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;

  const user = await User.findById(id).sort({ createdAt: -1 });

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
//     return
// );
