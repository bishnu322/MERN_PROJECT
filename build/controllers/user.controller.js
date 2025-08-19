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
exports.removeUser = exports.getById = exports.getAll = void 0;
const user_models_1 = require("../models/user.models");
const error_handler_middleware_1 = require("../middlewares/error-handler.middleware");
const async_handler_utils_1 = require("../utils/async-handler.utils");
const pagination_utils_1 = require("../utils/pagination.utils");
// get all users
exports.getAll = (0, async_handler_utils_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { current_page, per_page } = req.query;
    const page = Number(current_page) | 1;
    const limit = Number(per_page) | 10;
    const skip = (page - 1) * limit;
    const filter = {};
    const user = yield user_models_1.User.find(filter).limit(limit).skip(skip);
    const total = yield user_models_1.User.countDocuments(filter);
    const { total_page, next_page, pre_page, has_next_page, has_pre_page } = yield (0, pagination_utils_1.pagination)(page, limit, total);
    res.status(200).json({
        message: "get all data",
        status: "Success",
        success: true,
        data: user,
        pagination: {
            total_page,
            next_page,
            pre_page,
            has_next_page,
            has_pre_page,
        },
    });
}));
// get by id
exports.getById = (0, async_handler_utils_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const user = yield user_models_1.User.findById(id);
    if (!user) {
        throw new error_handler_middleware_1.CustomError("User not found!", 400);
    }
    res.status(200).json({
        message: "user fetched...",
        status: "Success",
        success: true,
        data: user,
    });
}));
// delete user
exports.removeUser = (0, async_handler_utils_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const user = yield user_models_1.User.findByIdAndDelete(id);
    if (!user) {
        throw new error_handler_middleware_1.CustomError("User not found! ", 404);
    }
    res.status(200).json({
        message: "user removed successfully..",
        status: "success",
        success: true,
        data: user,
    });
}));
// update profile
// export const updateUser = asyncHandler(
//   async (req: Request, res: Response, next: NextFunction) => {
//     return
// );
