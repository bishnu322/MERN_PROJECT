import { Request, Response } from "express";
import { asyncHandler } from "../utils/async-handler.utils";
import { Product } from "../models/product.models";
import { CustomError } from "../middlewares/error-handler.middleware";
import { Brand } from "../models/brand.models";
import Category from "../models/category.models";
import mongoose from "mongoose";
import cloudinary from "../config/cloudinary.config";
import { uploadFile } from "../utils/cloudinary-service.utils";

//* register product
const folder_name = "/products";

export const registerProduct = asyncHandler(
  async (req: Request, res: Response) => {
    const {
      name,
      brand,
      category,
      isFeatured,
      stock,
      price,
      description,
      size,
    } = req.body;

    const product_logo = req.file as Express.Multer.File;
    const createdBy = req.user._id.toString();

    if (!brand) {
      throw new CustomError("Brand is required!", 400);
    }

    if (!category) {
      throw new CustomError("category is required", 400);
    }

    const product = new Product({
      name,
      isFeatured,
      stock,
      price,
      description,
      size,
    });

    const { public_id, path } = await uploadFile(
      product_logo.path,
      folder_name
    );

    product.product_logo = {
      path,
      public_id,
    };

    const productBrand = await Brand.findById(brand);

    if (!productBrand) {
      throw new CustomError("Brand not found!", 404);
    }

    const productCategory = await Category.findById(category);

    if (!productCategory) {
      throw new CustomError("Product category not found!", 404);
    }

    product.brand = productBrand._id;
    product.category = productCategory._id;
    product.createdBy = new mongoose.Types.ObjectId(createdBy);

    await product.save();

    res.status(201).json({
      message: "product created successfully",
      status: "Success",
      success: true,
      data: product,
    });
  }
);

//* get all product

export const getAllProduct = asyncHandler(
  async (req: Request, res: Response) => {
    const product = await Product.find();

    res.status(200).json({
      message: "All product fetched",
      status: "Success",
      success: true,
      data: product,
    });
  }
);

//* get product by id

export const getProductById = asyncHandler(
  async (req: Request, res: Response) => {
    const { id } = req.params;

    const product = await Product.findById(id);

    if (!product) {
      throw new CustomError("Product not found!", 404);
    }

    res.status(200).json({
      message: "product fetched by id",
      status: "Success",
      success: true,
      data: product,
    });
  }
);

//* remove product

export const removeProduct = asyncHandler(
  async (req: Request, res: Response) => {
    const { id } = req.params;

    const product = await Product.findByIdAndDelete(id);

    if (!product) {
      throw new CustomError("Product not found!", 404);
    }

    res.status(200).json({
      message: "product removed successfully",
      status: "Success",
      success: true,
      data: product,
    });
  }
);

//* update product

export const updateProduct = asyncHandler(
  async (req: Request, res: Response) => {
    const { id } = req.params;
    const payload = req.body;

    const product = await Product.findByIdAndUpdate(
      { _id: id },
      { $set: payload }
    );

    if (!product) {
      throw new CustomError("product not found!", 404);
    }

    res.status(200).json({
      message: "product updated successfully",
      status: "Success",
      success: true,
      data: product,
    });
  }
);

//*  get by category

//*  get by brand
