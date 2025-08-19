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
exports.getCart = exports.createCart = void 0;
const async_handler_utils_1 = require("../utils/async-handler.utils");
const error_handler_middleware_1 = require("../middlewares/error-handler.middleware");
const cart_models_1 = require("../models/cart.models");
const product_models_1 = require("../models/product.models");
// create cart
exports.createCart = (0, async_handler_utils_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { productId, quantity } = req.body;
    const { _id: userId } = req.user;
    let cart;
    if (!productId) {
        throw new error_handler_middleware_1.CustomError("product id required", 400);
    }
    cart = yield cart_models_1.Cart.findOne({ user: userId });
    if (!cart) {
        cart = yield cart_models_1.Cart.create({ user: userId, total_amount: 0 });
    }
    const product = yield product_models_1.Product.findById(productId);
    if (!product) {
        throw new error_handler_middleware_1.CustomError("product not found", 404);
    }
    const isAlreadyExist = cart.items.find((item) => item.product === productId);
    if (isAlreadyExist) {
        isAlreadyExist.quantity += Number(quantity);
        cart.total_amount =
            cart.total_amount -
                isAlreadyExist.total_price +
                isAlreadyExist.quantity * product.price;
    }
    else {
        const total_price = Number(quantity) * product.price;
        const total_amount = cart.total_amount + total_price;
        cart.total_amount = total_amount;
        cart.items.push({ total_price, product: product._id, quantity });
    }
    yield cart.save();
    res.status(200).json({
        message: "product added to cart",
        status: "success",
        success: true,
        data: cart,
    });
}));
// get by cart
exports.getCart = (0, async_handler_utils_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const user = req.user._id;
    const cart = yield cart_models_1.Cart.findOne({ user });
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
// updateCart=
