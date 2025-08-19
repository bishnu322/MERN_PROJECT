"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getFeaturedProduct = exports.getProductByBrand = exports.getProductByCategory = exports.updateProduct = exports.removeProduct = exports.getProductById = exports.getAllProduct = exports.registerProduct = void 0;
const async_handler_utils_1 = require("../utils/async-handler.utils");
const product_models_1 = require("../models/product.models");
const error_handler_middleware_1 = require("../middlewares/error-handler.middleware");
const brand_models_1 = require("../models/brand.models");
const category_models_1 = __importDefault(require("../models/category.models"));
const mongoose_1 = __importDefault(require("mongoose"));
const cloudinary_service_utils_1 = require("../utils/cloudinary-service.utils");
const user_models_1 = require("../models/user.models");
const pagination_utils_1 = require("../utils/pagination.utils");
//* register product
const folder_name = "/products";
exports.registerProduct = (0, async_handler_utils_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { name, brand, category, isFeatured, stock, price, description, size, } = req.body;
    const createdBy = req.user._id.toString();
    if (!brand) {
        throw new error_handler_middleware_1.CustomError("Brand is required!", 400);
    }
    if (!category) {
        throw new error_handler_middleware_1.CustomError("category is required", 400);
    }
    //creating instance for product
    const product = new product_models_1.Product({
        name,
        isFeatured,
        stock,
        price,
        description,
        size,
    });
    const { cover_img, images } = req.files;
    if (cover_img) {
        const { path, public_id } = yield (0, cloudinary_service_utils_1.uploadFile)(cover_img[0].path, folder_name);
        product.cover_img = {
            path,
            public_id,
        };
    }
    if (Array.isArray(images) && images.length > 0) {
        const imagePaths = images.map((newImg) => __awaiter(void 0, void 0, void 0, function* () {
            return yield (0, cloudinary_service_utils_1.uploadFile)(newImg.path, folder_name);
        }));
        const newImages = yield Promise.all(imagePaths);
        product.set("images", newImages);
    }
    const productBrand = yield brand_models_1.Brand.findById(brand);
    if (!productBrand) {
        throw new error_handler_middleware_1.CustomError("Brand not found!", 404);
    }
    const productCategory = yield category_models_1.default.findById(category);
    if (!productCategory) {
        throw new error_handler_middleware_1.CustomError("Product category not found!", 404);
    }
    product.brand = productBrand._id;
    product.category = productCategory._id;
    product.createdBy = new mongoose_1.default.Types.ObjectId(createdBy);
    yield product.save();
    res.status(201).json({
        message: "product created successfully",
        status: "Success",
        success: true,
        data: product,
    });
}));
//* get all product
exports.getAllProduct = (0, async_handler_utils_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { current_page, per_page, query, category, brand, min_price, max_price, } = req.query;
    const filter = {};
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
    const product = yield product_models_1.Product.find(filter)
        .populate("brand")
        .populate("category")
        .populate("createdBy")
        .limit(limit)
        .skip(skip);
    const total = yield product_models_1.Product.countDocuments(filter);
    const { total_page, next_page, pre_page, has_next_page, has_pre_page } = yield (0, pagination_utils_1.pagination)(page, limit, total);
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
}));
//* get product by id
exports.getProductById = (0, async_handler_utils_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const product = yield product_models_1.Product.findById(id)
        .populate("brand")
        .populate("category")
        .populate("createdBy");
    if (!product) {
        throw new error_handler_middleware_1.CustomError("Product not found!", 404);
    }
    res.status(200).json({
        message: "product fetched by id",
        status: "Success",
        success: true,
        data: product,
    });
}));
//* remove product
exports.removeProduct = (0, async_handler_utils_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const product = yield product_models_1.Product.findById(id);
    if (!product) {
        throw new error_handler_middleware_1.CustomError("Product not found!", 404);
    }
    if (product.images && product.images.length > 0) {
        yield (0, cloudinary_service_utils_1.deleteFile)(product.images.map((img) => img.public_id));
    }
    if (product.cover_img) {
        yield (0, cloudinary_service_utils_1.deleteFile)([product.cover_img.public_id]);
    }
    yield product.deleteOne();
    res.status(200).json({
        message: "product removed successfully",
        status: "Success",
        success: true,
        data: product,
    });
}));
//* update product
exports.updateProduct = (0, async_handler_utils_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const { name, brand, category, createdBy, isFeatured, stock, price, description, size, deletedImages, } = req.body;
    const { cover_img, images } = req.files;
    let deletedImage = [];
    if (deletedImages) {
        deletedImage = JSON.parse(deletedImages);
    }
    const product = yield product_models_1.Product.findById(id);
    if (!product) {
        throw new error_handler_middleware_1.CustomError("product not found!", 404);
    }
    if (brand) {
        const brandToUpdate = yield brand_models_1.Brand.findById(brand);
        if (!brandToUpdate) {
            throw new error_handler_middleware_1.CustomError("brand not found", 404);
        }
        product.brand = brandToUpdate._id;
    }
    if (category) {
        const categoryToUpdate = yield brand_models_1.Brand.findById(category);
        if (!categoryToUpdate) {
            throw new error_handler_middleware_1.CustomError("brand not found", 404);
        }
        product.category = categoryToUpdate._id;
    }
    if (createdBy) {
        const createdByToUpdate = yield user_models_1.User.findById(createdBy);
        if (!createdByToUpdate) {
            throw new error_handler_middleware_1.CustomError("user not found!", 404);
        }
        product.createdBy = createdByToUpdate._id;
    }
    if (name)
        product.name = name;
    if (isFeatured)
        product.isFeatured = isFeatured;
    if (stock)
        product.stock = stock;
    if (price)
        product.price = price;
    if (description)
        product.description = description;
    if (size)
        product.size = size;
    if (cover_img) {
        const { path, public_id } = yield (0, cloudinary_service_utils_1.uploadFile)(cover_img[0].path, folder_name);
        if (product.cover_img) {
            yield (0, cloudinary_service_utils_1.deleteFile)([product.cover_img.public_id]);
        }
        product.cover_img = {
            path,
            public_id,
        };
    }
    //! if old images are deleted
    if (Array.isArray(deletedImage) && deletedImage.length > 0) {
        yield (0, cloudinary_service_utils_1.deleteFile)(deletedImage);
        const filterImages = product.images.filter((image) => !deletedImage.includes(image.public_id));
        product.set("images", filterImages);
    }
    // ! if new images uploaded
    if (images && images.length > 0) {
        const newImages = yield Promise.all(images.map((image) => __awaiter(void 0, void 0, void 0, function* () { return yield (0, cloudinary_service_utils_1.uploadFile)(image.path, folder_name); })));
        product.set("images", [...product.images, ...newImages]);
    }
    res.status(200).json({
        message: "product updated successfully",
        status: "Success",
        success: true,
        data: product,
    });
}));
//*  get by category
exports.getProductByCategory = (0, async_handler_utils_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { categoryId } = req.params;
    const products = yield product_models_1.Product.find({ category: categoryId })
        .populate("brand")
        .populate("createdBy")
        .populate("category");
    res.status(200).json({
        message: "product fetched  successfully",
        status: "Success",
        success: true,
        data: products,
    });
}));
//*  get by brand
exports.getProductByBrand = (0, async_handler_utils_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { brandId } = req.params;
    const products = yield product_models_1.Product.find({ brand: brandId })
        .populate("brand")
        .populate("createdBy")
        .populate("category");
    res.status(200).json({
        message: "product by brand fetched  successfully",
        status: "Success",
        success: true,
        data: products,
    });
}));
// * get featured product
exports.getFeaturedProduct = (0, async_handler_utils_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const products = yield product_models_1.Product.find({ isFeatured: true })
        .populate("brand")
        .populate("category")
        .populate("createdBy");
    res.status(200).json({
        message: "product by featured fetched  successfully",
        status: "Success",
        success: true,
        data: products,
    });
}));
