"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.User = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const enum_types_1 = require("../types/enum.types");
const userSchema = new mongoose_1.default.Schema({
    first_name: {
        type: String,
        required: [true, "first_name is required"],
        trim: true,
    },
    last_name: {
        type: String,
        required: [true, "last_name is required"],
        trim: true,
    },
    email: {
        type: String,
        required: [true, "email is required"],
        trim: true,
        unique: true,
    },
    password: {
        type: String,
        required: [true, "password is required"],
        min: 5,
        select: false,
    },
    phone_number: {
        type: String,
        max: 15,
    },
    role: {
        type: String,
        enum: Object.values(enum_types_1.Role),
        default: enum_types_1.Role.USER,
    },
    wish_list: [
        {
            type: mongoose_1.default.Schema.Types.ObjectId,
            ref: "Product",
            required: [true, "product is required"],
        },
    ],
}, { timestamps: true });
exports.User = mongoose_1.default.model("User", userSchema);
