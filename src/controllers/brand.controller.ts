import { Request, Response } from "express";
import { asyncHandler } from "../utils/async-handler.utils";
import { Brand } from "../models/brand.models";
import { CustomError } from "../middlewares/error-handler.middleware";
import { deleteFile, uploadFile } from "../utils/cloudinary-service.utils";
import { pagination } from "../utils/pagination.utils";

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
  const { current_page, per_page, query, category } = req.query;

  const filter: Record<string, any> = {};

  const page = Number(current_page) || 1;
  const limit = Number(per_page) || 10;
  const skip = (page - 1) * limit;

  if (query) {
    filter.$or = [
      {
        brand_name: {
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

  if (category) {
    filter.category = category;
  }

  const brand = await Brand.find(filter).limit(limit).skip(skip);

  const total = await Brand.countDocuments(filter);

  const { total_page, next_page, pre_page, has_next_page, has_pre_page } =
    await pagination(page, limit, total);

  res.status(200).json({
    message: "All brands",
    status: "Success",
    success: true,
    data: brand,
    pagination: {
      total_page,
      next_page,
      pre_page,
      has_next_page,
      has_pre_page,
    },
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

  const brand = await Brand.findById(id).populate("category");

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

  const brand = await Brand.findById(id);

  if (!brand) {
    throw new CustomError("brand not found", 404);
  }

  if (brand.logo) {
    await deleteFile([brand.logo.public_id]);
  }

  await brand.deleteOne();

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
