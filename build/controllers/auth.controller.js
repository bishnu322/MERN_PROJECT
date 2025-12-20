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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.profile = exports.logout = exports.changePassword = exports.login = exports.registerUser = void 0;
const bcrypt_utils_1 = require("../utils/bcrypt.utils");
const error_handler_middleware_1 = require("../middlewares/error-handler.middleware");
const user_models_1 = require("../models/user.models");
const async_handler_utils_1 = require("../utils/async-handler.utils");
const jwt_utils_1 = require("../utils/jwt.utils");
// registration
exports.registerUser = (0, async_handler_utils_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { first_name, last_name, email, password, phone_number } = req.body;
    const user = yield user_models_1.User.create({
        first_name,
        last_name,
        password,
        phone_number,
        email,
    });
    if (!password) {
        throw new error_handler_middleware_1.CustomError("password is required !", 400);
    }
    const hashedPassword = yield (0, bcrypt_utils_1.hashPassword)(password);
    user.password = hashedPassword;
    yield user.save();
    const _a = user._doc, { password: pass } = _a, newUser = __rest(_a, ["password"]);
    res.status(201).json({
        message: "registration succeeded",
        status: "success",
        success: true,
        data: newUser,
    });
}));
// login
exports.login = (0, async_handler_utils_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    //access email password
    const { email, password } = req.body;
    if (!email) {
        throw new error_handler_middleware_1.CustomError("email is required", 400);
    }
    if (!password) {
        throw new error_handler_middleware_1.CustomError("password is required", 400);
    }
    //find user by email
    const user = yield user_models_1.User.findOne({ email }).select("+password");
    if (!user) {
        throw new error_handler_middleware_1.CustomError("Invalid credential", 400);
    }
    const isPassMatch = yield (0, bcrypt_utils_1.compareHash)(password, (_a = user.password) !== null && _a !== void 0 ? _a : "");
    if (!isPassMatch) {
        throw new error_handler_middleware_1.CustomError("Invalid credential", 400);
    }
    const payload = {
        _id: user._id,
        role: user.role,
        email: user.email,
        first_name: user.first_name,
        last_name: user.last_name,
    };
    const access_token = (0, jwt_utils_1.generateToken)(payload);
    const _b = user._doc, { password: pass } = _b, loggedInUser = __rest(_b, ["password"]);
    res
        .cookie("access_token", access_token, {
        secure: process.env.NODE_ENV === "development" ? false : true,
        httpOnly: true,
        maxAge: Number(process.env.COOKIE_EXPIRY) * 24 * 60 * 60 * 1000,
        sameSite: "lax",
    })
        .status(200)
        .json({
        message: "get succeeded",
        status: "success",
        success: true,
        data: {
            data: loggedInUser,
            access_token,
        },
    });
}));
//*  forget password
//* change password
exports.changePassword = (0, async_handler_utils_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, old_password, new_password } = req.body;
    if (!new_password) {
        throw new error_handler_middleware_1.CustomError("new password is not registered..", 400);
    }
    if (!old_password) {
        throw new error_handler_middleware_1.CustomError("old password is not registered..", 400);
    }
    if (!email) {
        throw new error_handler_middleware_1.CustomError("email is required", 400);
    }
    const user = yield user_models_1.User.findOne({ email });
    if (!user) {
        throw new error_handler_middleware_1.CustomError("Something went wrong!!!", 500);
    }
    // const isPasswordMatch = user.password === old_password;
    // const isPasswordMatch = await bcrypt.compare(old_password, user.password);
    const isPasswordMatch = (0, bcrypt_utils_1.compareHash)(old_password, user.password);
    if (!isPasswordMatch) {
        throw new error_handler_middleware_1.CustomError("password does not match", 400);
    }
    const newHashedPassword = yield (0, bcrypt_utils_1.hashPassword)(new_password);
    user.password = newHashedPassword;
    yield user.save();
    res.status(201).json({
        message: "password changed successfully",
        status: "success",
        success: true,
    });
}));
// logout
exports.logout = (0, async_handler_utils_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    res
        .clearCookie("access_token", {
        secure: process.env.NODE_ENV === "development" ? false : true,
        httpOnly: true,
        sameSite: "none",
    })
        .status(200)
        .json({
        message: "User successfully logout",
        status: "success",
        success: true,
        data: null,
    });
}));
// check profile
exports.profile = (0, async_handler_utils_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.user._id;
    const user = yield user_models_1.User.findById(userId);
    if (!user) {
        throw new error_handler_middleware_1.CustomError("Profile found", 400);
    }
    res.status(200).json({
        message: "profile fetched",
        status: "success",
        success: true,
        data: user,
    });
}));
