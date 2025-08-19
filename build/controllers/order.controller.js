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
exports.cancel = exports.updateStatus = exports.getAllByUser = exports.getAll = exports.createOrder = void 0;
const async_handler_utils_1 = require("../utils/async-handler.utils");
const error_handler_middleware_1 = require("../middlewares/error-handler.middleware");
const product_models_1 = require("../models/product.models");
const order_models_1 = require("../models/order.models");
const enum_types_1 = require("../types/enum.types");
const mailer_utils_1 = require("../utils/mailer.utils");
const cart_models_1 = require("../models/cart.models");
exports.createOrder = (0, async_handler_utils_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { items, shipping_address } = req.body;
    const user = req.user._id;
    const { email } = req.user;
    if (!items) {
        throw new error_handler_middleware_1.CustomError("items required", 400);
    }
    if (!shipping_address) {
        throw new error_handler_middleware_1.CustomError("shipping_address required", 400);
    }
    const address = JSON.parse(shipping_address);
    const orderItems = JSON.parse(items);
    // *  preparing order items  with price
    const order = yield Promise.all(orderItems.map((item) => __awaiter(void 0, void 0, void 0, function* () {
        const product = yield product_models_1.Product.findById(item.product);
        if (!product) {
            return null;
        }
        //*   reducing products stock
        product.stock -= Number(item.quantity);
        yield product.save();
        return {
            product: product._id,
            quantity: Number(item.quantity),
            total_price: Number(item.quantity) * product.price,
        };
    })));
    //*   filter null elements
    const filteredOrderItems = order.filter((order) => order !== null);
    // * calculating  total amount
    const total_amount = filteredOrderItems.reduce((acc, val) => {
        return (acc += Number(val.total_price));
    }, 0);
    //* placing order
    const newOrder = yield order_models_1.Order.create({
        user,
        items: filteredOrderItems,
        total_amount,
        shipping_address: address,
    });
    const orderPlaced = yield order_models_1.Order.findById(newOrder._id)
        .populate({
        path: "items",
        populate: {
            path: "product",
            model: "Product", // optional if ref is correct
        },
    })
        .populate("user");
    // ! deleting cart after order is placed
    yield cart_models_1.Cart.findOneAndDelete({ user });
    let html = `
      <!DOCTYPE html>
  <html>
    <body style="margin: 0; padding: 0; background-color: #f9fafb; font-family: Arial, sans-serif;">
      <table align="center" width="700" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 8px; margin: 0 auto; padding: 20px;">
        <!-- Header -->
        <tr>
          <td style="text-align: center; padding: 20px 0; font-size: 24px; font-weight: bold; color: #065f46;">
            🛍️ Mern-kart
          </td>
        </tr>

        <!-- Message -->
        <tr>
          <td style="padding: 0 30px;">
            <p style="font-size: 16px;">Hey <strong>User</strong>,</p>
            <p style="color: #ea580c; font-size: 18px;"><span style="font-size: 20px;">✅</span> <strong>Your order is confirmed!</strong></p>
            <p style="color: #374151;">Thanks for shopping with us! Your order hasn't shipped yet, but we’ll send you a confirmation email with tracking details as soon as it does.</p>
          </td>
        </tr>

        <!-- Spacer -->
        <tr><td style="height: 30px;"></td></tr>

        <!-- Table -->
        <tr>
          <td style="padding: 0 30px;">
            <table width="100%" cellpadding="0" cellspacing="0" style="border-collapse: collapse; background-color: #f1f5f9; border-radius: 8px; overflow: hidden;">
              <thead style="background-color: #cbd5e1;">
                <tr>
                  <th style="padding: 12px; text-align: left; font-weight: bold;">Product</th>
                  <th style="padding: 12px; text-align: left; font-weight: bold;">Quantity</th>
                  <th style="padding: 12px; text-align: left; font-weight: bold;">Price</th>
                </tr>
              </thead>
              <tbody>
                <tr style="background-color: #ffffff;">
                  <td style="padding: 12px; color: #6b21a8;">${newOrder.items[0].product}</td>
                  <td style="padding: 12px;">${newOrder.items[0].quantity}</td>
                  <td style="padding: 12px; color: #6b21a8;">${newOrder.items[0].total_price}</td>
                </tr>
                <tr style="background-color: #f3f4f6;">
                  <td colspan="2" style="padding: 12px; text-align: right; font-weight: bold; color: #6b21a8;">Total Amount</td>
                  <td style="padding: 12px; font-weight: bold; color: #6b21a8;">${newOrder.total_amount}</td>
                </tr>
              </tbody>
            </table>
          </td>
        </tr>

        <!-- Footer Spacer -->
        <tr><td style="height: 30px;"></td></tr>
      </table>
    </body>
  </html>

    `;
    yield (0, mailer_utils_1.sendEmail)({
        html: html,
        subject: "Order Confirmed",
        to: email,
    });
    res.status(201).json({
        message: "order placed",
        data: newOrder,
        success: true,
        status: "success",
        newData: orderPlaced,
    });
}));
//* get all orders (only admin)
exports.getAll = (0, async_handler_utils_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const orders = yield order_models_1.Order.find({}).sort({ createdAt: -1 });
    res.status(200).json({
        message: "All order fetched",
        data: orders,
        success: true,
        status: "success",
    });
}));
//* get user order (only user)
exports.getAllByUser = (0, async_handler_utils_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const user = req.user._id;
    const orders = yield order_models_1.Order.find({ user }).sort({ createdAt: -1 });
    res.status(200).json({
        message: "All order fetched",
        data: orders,
        success: true,
        status: "success",
    });
}));
//* update order status (admin)
exports.updateStatus = (0, async_handler_utils_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { status } = req.body;
    const { id } = req.params;
    const order = yield order_models_1.Order.findByIdAndUpdate(id, { status }, { new: true });
    res.status(200).json({
        message: "Order Status updated",
        data: order,
        success: true,
        status: "success",
    });
}));
//* cancel order (only)
exports.cancel = (0, async_handler_utils_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const order = yield order_models_1.Order.findByIdAndUpdate(id, { status: enum_types_1.Order_status.CANCELLED }, { new: true });
    res.status(200).json({
        message: "Order Cancelled",
        data: order,
        success: true,
        status: "success",
    });
}));
