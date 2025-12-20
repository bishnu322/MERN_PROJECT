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
exports.clearWishList = exports.removeWishlist = exports.addToWishLit = exports.getWishList = void 0;
const async_handler_utils_1 = require("../utils/async-handler.utils");
const user_models_1 = require("../models/user.models");
const error_handler_middleware_1 = require("../middlewares/error-handler.middleware");
const product_models_1 = require("../models/product.models");
exports.getWishList = (0, async_handler_utils_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const userId = req.user._id;
    const user = yield user_models_1.User.findById(userId).populate("wish_list");
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
    const productId = req.body._id;
    const userId = req.user._id;
    if (!productId) {
        throw new error_handler_middleware_1.CustomError("product id is required!", 400);
    }
    // check product exists
    const product = yield product_models_1.Product.findById(productId);
    if (!product) {
        throw new error_handler_middleware_1.CustomError("product not found!", 404);
    }
    const user = yield user_models_1.User.findById(userId);
    if (!user) {
        throw new error_handler_middleware_1.CustomError("user not found!", 404);
    }
    // check if product already exists in wishlist
    const exists = user.wish_list.some((id) => id.toString() === product._id.toString());
    if (exists) {
        // if product already exists
        return res.status(200).json({
            message: "product already exist in wishlist",
            success: true,
            data: user.wish_list,
        });
    }
    else {
        // add product
        user.wish_list.push(product._id);
        yield user.save();
        return res.status(200).json({
            message: "product added to wishlist",
            success: true,
            data: user.wish_list,
        });
    }
}));
// remove product from wishlist
exports.removeWishlist = (0, async_handler_utils_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const productId = req.body._id;
    const userId = req.user._id;
    if (!productId) {
        throw new error_handler_middleware_1.CustomError("product id is required! ", 401);
    }
    const user = yield user_models_1.User.findById(userId);
    if (!user) {
        throw new error_handler_middleware_1.CustomError("User doesn't exist", 401);
    }
    const wishlist = user.wish_list.filter((id) => id.toString() !== productId.toString());
    user.wish_list = wishlist;
    yield user.save();
    return res.status(200).json({
        message: "product removed from wishlist",
        status: "Success",
        success: true,
        data: wishlist,
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
