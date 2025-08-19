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
Object.defineProperty(exports, "__esModule", { value: true });
exports.getBrandById = exports.removeBrand = exports.updateBrand = exports.getAllBrand = exports.registerBrand = void 0;
const async_handler_utils_1 = require("../utils/async-handler.utils");
const brand_models_1 = require("../models/brand.models");
const error_handler_middleware_1 = require("../middlewares/error-handler.middleware");
const cloudinary_service_utils_1 = require("../utils/cloudinary-service.utils");
const pagination_utils_1 = require("../utils/pagination.utils");
//* brand registration
const folder_name = "/brands";
exports.registerBrand = (0, async_handler_utils_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { brand_name, slug, description, isActive, categories, averageRating, ratingCount, } = req.body;
    const logo = req.file;
    if (!brand_name) {
        throw new error_handler_middleware_1.CustomError("brand name is required !", 400);
    }
    if (!description) {
        throw new error_handler_middleware_1.CustomError("Brand description is required !", 400);
    }
    const brand = new brand_models_1.Brand({
        brand_name,
        slug,
        description,
        isActive,
        categories,
        averageRating,
        ratingCount,
    });
    // const uploadedData = await uploadFile(logo.path, folder_name);
    const { path, public_id } = yield (0, cloudinary_service_utils_1.uploadFile)(logo.path, folder_name);
    brand.logo = {
        path,
        public_id,
    };
    // brand.logo = {
    //   path: uploadedData.path,
    //   public_id: uploadedData.public_id,
    // };
    yield brand.save();
    res.status(201).json({
        message: "Brand created successfully",
        status: "success",
        success: true,
        data: brand,
    });
}));
//* get All brands
exports.getAllBrand = (0, async_handler_utils_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { current_page, per_page, query, category } = req.query;
    const filter = {};
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
    const brand = yield brand_models_1.Brand.find(filter).limit(limit).skip(skip);
    const total = yield brand_models_1.Brand.countDocuments(filter);
    const { total_page, next_page, pre_page, has_next_page, has_pre_page } = yield (0, pagination_utils_1.pagination)(page, limit, total);
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
}));
//* updating brand
exports.updateBrand = (0, async_handler_utils_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const { brand_name, description } = req.body;
    const logo = req.file;
    if (!id) {
        throw new error_handler_middleware_1.CustomError("brand not found !", 400);
    }
    const brand = yield brand_models_1.Brand.findById(id).populate("category");
    if (!brand)
        throw new error_handler_middleware_1.CustomError("brand_name is required", 404);
    if (brand_name)
        brand.brand_name = brand_name;
    if (description)
        brand.description = description;
    if (logo) {
        const { path, public_id } = yield (0, cloudinary_service_utils_1.uploadFile)(logo.path, folder_name);
        // delete old image
        if (brand.logo) {
            yield (0, cloudinary_service_utils_1.deleteFile)([brand.logo.public_id]);
        }
        //update new image
        brand.logo = {
            path,
            public_id,
        };
    }
    yield brand.save();
    res.status(200).json({
        message: "brand updated successfully",
        status: "Success",
        success: true,
        data: brand,
    });
}));
//* remove brand
exports.removeBrand = (0, async_handler_utils_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const brand = yield brand_models_1.Brand.findById(id);
    if (!brand) {
        throw new error_handler_middleware_1.CustomError("brand not found", 404);
    }
    if (brand.logo) {
        yield (0, cloudinary_service_utils_1.deleteFile)([brand.logo.public_id]);
    }
    yield brand.deleteOne();
    res.status(200).json({
        message: "brand removed",
        status: "Success",
        success: true,
        data: brand,
    });
}));
//* get BY ID
exports.getBrandById = (0, async_handler_utils_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const brand = yield brand_models_1.Brand.findById(id);
    res.status(200).json({
        message: "brand by ID",
        status: "Success",
        success: true,
        data: brand,
    });
}));
