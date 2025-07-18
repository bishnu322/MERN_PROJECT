import { Request, Response } from "express";
import { asyncHandler } from "../utils/asyncHandler_utils";
import { Brand } from "../models/brand.models";
import { CustomError } from "../middlewares/errorHandler.middleware";

//* brand registration

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

    if (!description) {
      throw new CustomError("Brand description is required !", 400);
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

    res.status(201).json({
      message: "Brand created successfully",
      status: "success",
      success: true,
      data: brand,
    });
  }
);

//* get All brands

export const getAllBrand = asyncHandler(async (req: Request, res: Response) => {
  const brand = await Brand.find();

  res.status(200).json({
    message: "All brands",
    status: "Success",
    success: true,
    data: brand,
  });
});

//* remove brand

export const removeBrand = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;

  const brand = await Brand.findByIdAndDelete(id);

  res.status(200).json({
    message: "brand removed",
    status: "Success",
    success: true,
    data: brand,
  });
});

//* get BY ID

export const getBrandById = asyncHandler(
  async (req: Request, res: Response) => {
    const { id } = req.params;

    const brand = await Brand.findById(id);

    res.status(200).json({
      message: "brand by ID",
      status: "Success",
      success: true,
      data: brand,
    });
  }
);
