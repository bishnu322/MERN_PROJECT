"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorHandler = exports.CustomError = void 0;
// CustomError handler
class CustomError extends Error {
    constructor(message, statusCode) {
        super(message);
        this.statusCode = statusCode || 500;
        this.status = statusCode >= 400 && statusCode < 500 ? "fail" : "error";
        this.success = false;
        Error.captureStackTrace(this, CustomError);
    }
}
exports.CustomError = CustomError;
//Edge case errorHandler
const errorHandler = (error, req, res, next) => {
    var _a;
    const statusCode = (error === null || error === void 0 ? void 0 : error.statusCode) || 500;
    const message = (error === null || error === void 0 ? void 0 : error.message) || "Internal Server Error";
    const success = (_a = error === null || error === void 0 ? void 0 : error.statusCode) !== null && _a !== void 0 ? _a : "false";
    const status = (error === null || error === void 0 ? void 0 : error.status) || "error";
    res.status(statusCode).json({
        message,
        statusCode,
        status,
        success,
        data: null,
    });
};
exports.errorHandler = errorHandler;
