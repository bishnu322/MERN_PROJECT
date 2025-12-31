import { Request, Response } from "express";
import { asyncHandler } from "../utils/async-handler.utils";
import { Product } from "../models/product.models";
import { CustomError } from "../middlewares/error-handler.middleware";
import { Brand } from "../models/brand.models";
import Category from "../models/category.models";
import mongoose from "mongoose";
import { deleteFile, uploadFile } from "../utils/cloudinary-service.utils";
import { User } from "../models/user.models";
import { pagination } from "../utils/pagination.utils";

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

    const createdBy = req.user._id.toString();

    if (!brand) {
      throw new CustomError("Brand is required!", 400);
    }

    if (!category) {
      throw new CustomError("category is required", 400);
    }

    //creating instance for product
    const product = new Product({
      name,
      isFeatured,
      stock,
      price,
      description,
      size,
    });

    // handle uploaded files safely
    const files = (req.files || {}) as {
      cover_img?: Express.Multer.File[];
      images?: Express.Multer.File[];
    };

    const { cover_img, images } = files;

    // 🔴 Ensure cover_img exists because schema requires it
    if (!cover_img || cover_img.length === 0) {
      throw new CustomError("cover_img is required", 400);
    }

    // upload cover image
    const { path, public_id } = await uploadFile(
      cover_img[0].path,
      folder_name
    );

    product.cover_img = {
      path,
      public_id,
    };

    // upload additional images if present
    if (Array.isArray(images) && images.length > 0) {
      const imagePaths = images.map(async (newImg) => {
        return await uploadFile(newImg.path, folder_name);
      });

      const newImages = await Promise.all(imagePaths);
      product.set("images", newImages);
    }

    // validate brand and category
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
    const {
      current_page,
      per_page,
      query,
      category,
      brand,
      min_price,
      max_price,
    } = req.query;

    const filter: Record<string, any> = {};

    const page = Number(current_page) || 1;
    const limit = Number(per_page) || 10;
    const skip = (page - 1) * limit;

    // if (query) {
    //   filter.name = {
    //     $regex: query,
    //     $options: "i",
    //   };
    // }

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

    // category filter

    if (category) {
      filter.category = category;
    }

    // brand filter

    if (brand) {
      filter.brand = brand;
    }

    // price range
    if (min_price || max_price) {
      if (min_price) {
        filter.price = {
          $gte: min_price,
        };
      }

      if (max_price) {
        filter.price = {
          $lte: max_price,
        };
      }
    }

    const product = await Product.find(filter)
      .populate("brand")
      .populate("category")
      .populate("createdBy")
      .limit(limit)
      .skip(skip)
      .sort({ createdAt: -1 });

    const total = await Product.countDocuments(filter);

    const { total_page, next_page, pre_page, has_next_page, has_pre_page } =
      await pagination(page, limit, total);

    res.status(200).json({
      message: "All product fetched",
      status: "Success",
      success: true,
      data: product,
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

//* get product by id

export const getProductById = asyncHandler(
  async (req: Request, res: Response) => {
    const { id } = req.params;

    const product = await Product.findById(id)
      .populate("brand")
      .populate("category")
      .populate("createdBy");

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

    const product = await Product.findById(id);

    if (!product) {
      throw new CustomError("Product not found!", 404);
    }

    if (product.images && product.images.length > 0) {
      await deleteFile(product.images.map((img: any) => img.public_id));
    }

    if (product.cover_img) {
      await deleteFile([product.cover_img.public_id]);
    }

    await product.deleteOne();

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
    const {
      name,
      brand,
      category,
      createdBy,
      isFeatured,
      stock,
      price,
      description,
      size,
      deletedImages,
    } = req.body;

    const { cover_img, images } = req.files as {
      [fieldname: string]: Express.Multer.File[];
    };

    let deletedImage: string[] = [];

    if (deletedImages) {
      deletedImage = JSON.parse(deletedImages);
    }

    const product = await Product.findById(id);

    if (!product) {
      throw new CustomError("product not found!", 404);
    }

    if (brand) {
      const brandToUpdate = await Brand.findById(brand);

      if (brandToUpdate) {
        product.brand = brandToUpdate._id;
      }
    }

    if (category) {
      const categoryToUpdate = await Brand.findById(category);

      if (categoryToUpdate) {
        product.category = categoryToUpdate._id;
      }
    }

    if (createdBy) {
      const createdByToUpdate = await User.findById(createdBy);

      if (!createdByToUpdate) {
        throw new CustomError("user not found!", 404);
      }

      product.createdBy = createdByToUpdate._id;
    }

    if (name) product.name = name;
    if (isFeatured) product.isFeatured = isFeatured;
    if (stock) product.stock = stock;
    if (price) product.price = price;
    if (description) product.description = description;
    if (size) product.size = size;

    if (cover_img) {
      const { path, public_id } = await uploadFile(
        cover_img[0].path,
        folder_name
      );

      if (product.cover_img) {
        await deleteFile([product.cover_img.public_id]);
      }

      product.cover_img = {
        path,
        public_id,
      };
    }

    //! if old images are deleted
    if (Array.isArray(deletedImage) && deletedImage.length > 0) {
      await deleteFile(deletedImage);

      const filterImages = product.images.filter(
        (image) => !deletedImage.includes(image.public_id as string)
      );
      product.set("images", filterImages);
    }

    // ! if new images uploaded
    if (images && images.length > 0) {
      const newImages = await Promise.all(
        images.map(async (image) => await uploadFile(image.path, folder_name))
      );

      product.set("images", [...product.images, ...newImages]);
    }

    product.save();

    res.status(200).json({
      message: "product updated successfully",
      status: "Success",
      success: true,
      data: product,
    });
  }
);

//*  get by category

export const getProductByCategory = asyncHandler(
  async (req: Request, res: Response) => {
    const { categoryId } = req.params;

    const products = await Product.find({ category: categoryId })
      .populate("brand")
      .populate("createdBy")
      .populate("category");

    res.status(200).json({
      message: "product fetched  successfully",
      status: "Success",
      success: true,
      data: products,
    });
  }
);

//*  get by brand

export const getProductByBrand = asyncHandler(
  async (req: Request, res: Response) => {
    const { brandId } = req.params;

    const products = await Product.find({ brand: brandId })
      .populate("brand")
      .populate("createdBy")
      .populate("category");

    res.status(200).json({
      message: "product by brand fetched  successfully",
      status: "Success",
      success: true,
      data: products,
    });
  }
);

// * get featured product

export const getFeaturedProduct = asyncHandler(
  async (req: Request, res: Response) => {
    const products = await Product.find({ isFeatured: true })
      .populate("brand")
      .populate("category")
      .populate("createdBy");

    res.status(200).json({
      message: "product by featured fetched  successfully",
      status: "Success",
      success: true,
      data: products,
    });
  }
);
