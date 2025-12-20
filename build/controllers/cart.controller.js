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
exports.getCart = exports.createCart = void 0;
const async_handler_utils_1 = require("../utils/async-handler.utils");
const error_handler_middleware_1 = require("../middlewares/error-handler.middleware");
const cart_models_1 = require("../models/cart.models");
const product_models_1 = require("../models/product.models");
const mongoose_1 = __importDefault(require("mongoose"));
// create cart
exports.createCart = (0, async_handler_utils_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { productId, quantity } = req.body;
    const { _id: userId } = req.user;
    if (!productId) {
        throw new error_handler_middleware_1.CustomError("Product id required", 400);
    }
    if (!mongoose_1.default.Types.ObjectId.isValid(productId)) {
        throw new error_handler_middleware_1.CustomError("Invalid product id", 400);
    }
    const qty = Number(quantity) || 1;
    // find or create product
    let cart = yield cart_models_1.Cart.findOne({ user: userId });
    if (!cart) {
        cart = yield cart_models_1.Cart.create({
            user: userId,
            items: [],
            total_amount: 0,
        });
    }
    // find product
    const product = yield product_models_1.Product.findById(productId);
    if (!product) {
        throw new error_handler_middleware_1.CustomError("Product not found", 404);
    }
    // check product is already exist
    const existingItem = cart.items.find((item) => { var _a; return (_a = item === null || item === void 0 ? void 0 : item.product) === null || _a === void 0 ? void 0 : _a.equals(product._id); });
    if (existingItem) {
        // update quantity
        existingItem.quantity += qty;
        // update total price of item
        existingItem.total_price = existingItem.quantity * product.price;
    }
    else {
        // add new item
        cart.items.push({
            product: product._id,
            quantity: qty,
            total_price: qty * product.price,
        });
    }
    // recalculate to amount
    cart.total_amount = cart.items.reduce((sum, item) => sum + item.total_price, 0);
    yield cart.save();
    // populate after saving
    yield cart.populate([
        { path: "user", select: "-password" },
        { path: "items.product" },
    ]);
    res.status(200).json({
        success: true,
        status: "success",
        message: "Product added to cart",
        data: cart,
    });
}));
// get by cart
exports.getCart = (0, async_handler_utils_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const user = req.user._id;
    const cart = yield cart_models_1.Cart.findOne({ user })
        .populate({ path: "user" })
        .populate({
        path: "items.product",
        populate: [
            {
                path: "brand",
                model: "Brand",
            },
            {
                path: "category",
                model: "Category",
            },
        ],
    });
    if (!cart) {
        throw new error_handler_middleware_1.CustomError("Cart is not created yet", 400);
    }
    res.status(200).json({
        message: "cart fetched",
        success: true,
        status: "success",
        data: cart,
    });
}));
