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
exports.removeCategory = exports.updateCategory = exports.getCategoryById = exports.getAllCategory = exports.registerCategory = void 0;
const async_handler_utils_1 = require("../utils/async-handler.utils");
const error_handler_middleware_1 = require("../middlewares/error-handler.middleware");
const category_models_1 = __importDefault(require("../models/category.models"));
const pagination_utils_1 = require("../utils/pagination.utils");
//* register category
exports.registerCategory = (0, async_handler_utils_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { name, description } = req.body;
    if (!name) {
        throw new error_handler_middleware_1.CustomError("Category name is required !", 400);
    }
    if (!description) {
        throw new error_handler_middleware_1.CustomError("Category description is required !", 400);
    }
    const category = yield category_models_1.default.create({
        name,
        description,
    });
    res.status(201).json({
        message: "Category register successfully",
        status: "Success",
        success: true,
        data: category,
    });
}));
//* get all category
exports.getAllCategory = (0, async_handler_utils_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { current_page, per_page, query } = req.query;
    const filter = {};
    const page = Number(current_page) || 1;
    const limit = Number(per_page) || 10;
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
    const category = yield category_models_1.default.find(filter)
        .limit(limit)
        .skip(skip)
        .sort({ createdAt: -1 });
    const total = yield category_models_1.default.countDocuments(filter);
    const { total_page, next_page, pre_page, has_next_page, has_pre_page } = yield (0, pagination_utils_1.pagination)(page, limit, total);
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
}));
//* get category by Id
exports.getCategoryById = (0, async_handler_utils_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const category = yield category_models_1.default.findById(id);
    if (!category) {
        throw new error_handler_middleware_1.CustomError("Category does not exists", 400);
    }
    res.status(200).json({
        message: "Category fetch successfully",
        status: "Success",
        success: true,
        data: category,
    });
}));
//* update category
exports.updateCategory = (0, async_handler_utils_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const payload = req.body;
    const category = yield category_models_1.default.findByIdAndUpdate({ _id: id }, { $set: payload });
    res.status(200).json({
        message: "updated successfully",
        status: "Success",
        success: true,
        data: category,
    });
}));
//* remove category
exports.removeCategory = (0, async_handler_utils_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const category = yield category_models_1.default.findByIdAndDelete(id);
    if (!category) {
        throw new error_handler_middleware_1.CustomError("Category does not found !", 400);
    }
    res.status(200).json({
        message: "Category removed   successfully",
        status: "Success",
        success: true,
        data: category,
    });
}));
