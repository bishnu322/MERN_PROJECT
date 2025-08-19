"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Order = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const enum_types_1 = require("../types/enum.types");
const orderSchema = new mongoose_1.default.Schema({
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
                required: [true, "product is required"],
            },
            quantity: {
                type: Number,
                required: [true, "quantity is required"],
            },
            total_price: {
                type: Number,
                required: [true, "total price is required"],
            },
        },
    ],
    total_amount: {
        type: Number,
        required: [true, "total amount is required"],
    },
    shipping_address: {
        country: {
            type: String,
            trim: true,
            default: "Nepal",
        },
        state: {
            type: String,
            trim: true,
            required: [true, "state is required"],
        },
        city: {
            type: String,
            trim: true,
            required: [true, "city is required"],
        },
        street: {
            type: String,
            trim: true,
            required: [true, "street is required"],
        },
    },
    status: {
        type: String,
        enum: Object.values(enum_types_1.Order_status),
        default: enum_types_1.Order_status.PENDING,
    },
    payment_method: {
        type: String,
        enum: Object.values(enum_types_1.Payment_method),
        default: enum_types_1.Payment_method.COD,
    },
}, { timestamps: true });
exports.Order = mongoose_1.default.model("Order", orderSchema);
