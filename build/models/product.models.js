"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Product = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const productSchema = new mongoose_1.default.Schema({
    name: {
        type: String,
        required: [true, "product name is required"],
        trim: true,
    },
    brand: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: "Brand",
        required: [true, "brand is required !"],
    },
    category: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: "Category",
        required: [true, "Category is required !"],
    },
    images: [
        {
            path: {
                type: String,
            },
            public_id: {
                type: String,
            },
        },
    ],
    cover_img: {
        path: {
            type: String,
            required: true,
        },
        public_id: {
            type: String,
            required: true,
        },
    },
    createdBy: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: "User",
        required: [true, "createdBy is required !"],
    },
    isFeatured: {
        type: Boolean,
        default: false,
    },
    stock: {
        type: Number,
        default: 0,
    },
    price: {
        type: Number,
        required: [true, "price is required!"],
        min: [0, "price must be positive number"],
    },
    description: {
        type: String,
    },
    size: {
        type: String,
    },
}, { timestamps: true });
exports.Product = mongoose_1.default.model("Product", productSchema);
