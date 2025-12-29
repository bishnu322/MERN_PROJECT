import { Request, Response } from "express";
import { asyncHandler } from "../utils/async-handler.utils";
import { CustomError } from "../middlewares/error-handler.middleware";
import Category from "../models/category.models";
import { pagination } from "../utils/pagination.utils";

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
    const { current_page, per_page, query } = req.query;

    const filter: Record<string, any> = {};
    const page = Number(current_page) || 1;
    const limit = Number(per_page) || 30;
    const skip = (page - 1) * limit;

    if (query) {
      filter.$or = [
        {
          name: {
            $regex: query,
            $options: "i",
          },
        },
        {
          description: {
            $regex: query,
            $options: "i",
          },
        },
      ];
    }

    const category = await Category.find(filter)
      .limit(limit)
      .skip(skip)
      .sort({ createdAt: -1 });

    const total = await Category.countDocuments(filter);

    const { total_page, next_page, pre_page, has_next_page, has_pre_page } =
      await pagination(page, limit, total);

    res.status(200).json({
      message: "All Category fetch successfully",
      status: "Success",
      success: true,
      data: category,
      pagination: {
        total_page,
        next_page,
        pre_page,
        has_next_page,
        has_pre_page,
      },
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
