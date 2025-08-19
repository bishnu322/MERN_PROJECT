"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DB_CONNECTION = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const DB_CONNECTION = (DB_URI) => {
    mongoose_1.default
        .connect(DB_URI)
        .then(() => {
        console.log("DB connected successfully");
    })
        .catch((error) => {
        console.log("DB connection error", error);
    });
};
exports.DB_CONNECTION = DB_CONNECTION;
