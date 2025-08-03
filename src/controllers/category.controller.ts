import { Request, Response } from "express";
import { asyncHandler } from "../utils/async-handler.utils";
import { CustomError } from "../middlewares/error-handler.middleware";
import Category from "../models/category.models";

//* register category

export const registerCategory = asyncHandler(
  async (req: Request, res: Response) => {
    const { name, description } = req.body;

    if (!name) {
      throw new CustomError("Category name is required !", 400);
    }

    if (!description) {
      throw new CustomError("Category description is required !", 400);
    }

    const category = await Category.create({
      name,
      description,
    });

    res.status(201).json({
      message: "Category register successfully",
      status: "Success",
      success: true,
      data: category,
    });
  }
);

//* get all category

export const getAllCategory = asyncHandler(
  async (req: Request, res: Response) => {
    const category = await Category.find();

    res.status(200).json({
      message: "All Category fetch successfully",
      status: "Success",
      success: true,
      data: category,
    });
  }
);

//* get category by Id

export const getCategoryById = asyncHandler(
  async (req: Request, res: Response) => {
    const { id } = req.params;

    const category = await Category.findById(id);

    if (!category) {
      throw new CustomError("Category does not exists", 400);
    }

    res.status(200).json({
      message: "Category fetch successfully",
      status: "Success",
      success: true,
      data: category,
    });
  }
);

//* update category

export const updateCategory = asyncHandler(
  async (req: Request, res: Response) => {
    const { id } = req.params;
    const payload = req.body;

    const category = await Category.findByIdAndUpdate(
      { _id: id },
      { $set: payload }
    );

    res.status(200).json({
      message: "updated successfully",
      status: "Success",
      success: true,
      data: category,
    });
  }
);

//* remove category

export const removeCategory = asyncHandler(
  async (req: Request, res: Response) => {
    const { id } = req.params;

    const category = await Category.findByIdAndDelete(id);

    if (!category) {
      throw new CustomError("Category does not found !", 400);
    }

    res.status(200).json({
      message: "Category removed   successfully",
      status: "Success",
      success: true,
      data: category,
    });
  }
);
