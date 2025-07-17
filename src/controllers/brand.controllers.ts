import { Request, Response } from "express";
import { asyncHandler } from "../utils/asyncHandler_utils";
import { Brand } from "../models/brand.models";
import { CustomError } from "../middlewares/errorHandler.middleware";

export const registerBrand = asyncHandler(
  async (req: Request, res: Response) => {
    const {
      brand_name,
      slug,
      description,
      logo,
      isActive,
      categories,
      averageRating,
      ratingCount,
    } = req.body;

    if (!brand_name) {
      throw new CustomError("brand name is required !", 400);
    }

    if (!slug) {
      throw new CustomError("slug is required !", 400);
    }

    if (!description) {
      throw new CustomError("Brand description is required !", 400);
    }

    if (!categories) {
      throw new CustomError("category is required !", 400);
    }

    const brand = await Brand.create({
      brand_name,
      slug,
      description,
      logo,
      isActive,
      categories,
      averageRating,
      ratingCount,
    });

    res.status(200).json({
      message: "Brand created successfully",
      status: "success",
      success: true,
      data: brand,
    });
  }
);
