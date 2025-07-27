import { Request, Response } from "express";
import { asyncHandler } from "../utils/async-handler.utils";
import { Brand } from "../models/brand.models";
import { CustomError } from "../middlewares/error-handler.middleware";
import { deleteFile, uploadFile } from "../utils/cloudinary-service.utils";

//* brand registration

const folder_name = "/brands";

export const registerBrand = asyncHandler(
  async (req: Request, res: Response) => {
    const {
      brand_name,
      slug,
      description,
      isActive,
      categories,
      averageRating,
      ratingCount,
    } = req.body;

    const logo = req.file as Express.Multer.File;

    if (!brand_name) {
      throw new CustomError("brand name is required !", 400);
    }

    if (!description) {
      throw new CustomError("Brand description is required !", 400);
    }

    const brand = new Brand({
      brand_name,
      slug,
      description,
      isActive,
      categories,
      averageRating,
      ratingCount,
    });

    // const uploadedData = await uploadFile(logo.path, folder_name);
    const { path, public_id } = await uploadFile(logo.path, folder_name);

    brand.logo = {
      path,
      public_id,
    };
    // brand.logo = {
    //   path: uploadedData.path,
    //   public_id: uploadedData.public_id,
    // };

    await brand.save();

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

//* updating brand

export const updateBrand = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const { brand_name, description } = req.body;

  const logo = req.file as Express.Multer.File;

  if (!id) {
    throw new CustomError("brand not found !", 400);
  }

  const brand = await Brand.findById(id);

  if (!brand) throw new CustomError("brand_name is required", 404);

  if (brand_name) brand.brand_name = brand_name;
  if (description) brand.description = description;

  if (logo) {
    const { path, public_id } = await uploadFile(logo.path, folder_name);

    // delete old image
    if (brand.logo) {
      await deleteFile([brand.logo.public_id]);
    }

    //update new image
    brand.logo = {
      path,
      public_id,
    };
  }

  await brand.save();

  res.status(200).json({
    message: "brand updated successfully",
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
