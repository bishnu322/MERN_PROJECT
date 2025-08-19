"use strict";
//get wishlist
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
exports.clearWishList = exports.addToWishLit = exports.getWishList = void 0;
const async_handler_utils_1 = require("../utils/async-handler.utils");
const user_models_1 = require("../models/user.models");
const error_handler_middleware_1 = require("../middlewares/error-handler.middleware");
const product_models_1 = require("../models/product.models");
exports.getWishList = (0, async_handler_utils_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const userId = req.user._id;
    const user = yield user_models_1.User.findById(userId).populate("wish_list.product");
    if (!user) {
        throw new error_handler_middleware_1.CustomError("wishList not found!", 404);
    }
    res.status(200).json({
        message: "Fetched wishList",
        status: "Success",
        success: true,
        data: (_a = user.wish_list) !== null && _a !== void 0 ? _a : [],
    });
}));
//add wishlist
exports.addToWishLit = (0, async_handler_utils_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const productId = req.body;
    const userId = req.user._id;
    if (!productId) {
        throw new error_handler_middleware_1.CustomError("product id is required !", 400);
    }
    const product = yield product_models_1.Product.findById(productId.id);
    // console.log(product);
    if (!product) {
        throw new error_handler_middleware_1.CustomError("product not found!", 404);
    }
    const user = yield user_models_1.User.findById(userId);
    let isProductAlreadyExists = user === null || user === void 0 ? void 0 : user.wish_list.find((id) => product._id.toString() === id.toString());
    if (isProductAlreadyExists) {
        let list = user === null || user === void 0 ? void 0 : user.wish_list.filter((id) => product.id.toString !== id.toString());
        yield (user === null || user === void 0 ? void 0 : user.set("wish_list", list));
        return res.status(200).json({
            message: "product removed to wish_list",
            status: "Success",
            success: true,
        });
    }
    user === null || user === void 0 ? void 0 : user.wish_list.push(product._id);
    yield (user === null || user === void 0 ? void 0 : user.save());
    res.status(200).json({
        message: "product added to wish_list",
        status: "Success",
        success: true,
        data: user === null || user === void 0 ? void 0 : user.wish_list,
    });
}));
//clear wishlist
exports.clearWishList = (0, async_handler_utils_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.user._id;
    const user = yield user_models_1.User.findById(userId);
    if (!user) {
        throw new error_handler_middleware_1.CustomError("User not found", 404);
    }
    user.set("wish_list", []);
    // user.wish_list.splice(0, user.wish_list.length)
    yield user.save();
    res.status(200).json({
        message: "Wishlist successfully deleted",
        success: true,
        status: "success",
        data: user.wish_list,
    });
}));
