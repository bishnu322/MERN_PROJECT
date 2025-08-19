"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Brand = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const brandSchema = new mongoose_1.default.Schema({
    brand_name: {
        type: String,
        required: [true, "Brand_name is required !"],
        trim: true,
        unique: [true, "Brand name already exists"],
        maxLength: 50,
    },
    slug: {
        type: String,
    },
    description: {
        type: String,
        required: [true, "brand description is required !"],
    },
    logo: {
        path: {
            type: String,
            required: true,
        },
        public_id: {
            type: String,
            required: true,
        },
    },
    isActive: {
        type: Boolean,
        default: true,
    },
    averageRating: {
        type: Number,
        default: 0,
        min: 0,
        max: 5,
    },
    ratingCount: {
        type: Number,
        default: 0,
    },
}, { timestamps: true });
exports.Brand = mongoose_1.default.model("Brand", brandSchema);
