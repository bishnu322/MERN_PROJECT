"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Cart = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const cartSchema = new mongoose_1.default.Schema({
    user: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: "User",
        required: [true, "user is required"],
    },
    items: [
        {
            product: {
                type: mongoose_1.default.Schema.Types.ObjectId,
                ref: "Product",
            },
            quantity: {
                type: Number,
                required: [true, "quantity is required"],
                default: 0,
            },
            total_price: {
                type: Number,
                required: true,
                default: 0,
            },
        },
    ],
    total_amount: {
        type: Number,
        required: [true, "total amount is required"],
        default: 0,
    },
});
exports.Cart = mongoose_1.default.model("Cart", cartSchema);
