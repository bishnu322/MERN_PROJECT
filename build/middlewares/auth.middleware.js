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
exports.authenticate = void 0;
const error_handler_middleware_1 = require("./error-handler.middleware");
const jwt_utils_1 = require("../utils/jwt.utils");
const user_models_1 = require("../models/user.models");
const authenticate = (role) => {
    return (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            // get token from cookie
            const access_token = req.cookies.access_token;
            // verify token
            if (!access_token) {
                throw new error_handler_middleware_1.CustomError("Unauthorized, access denied!", 401);
            }
            //  making instance of token data
            const decodedData = (0, jwt_utils_1.verifyToken)(access_token);
            //* check token expiry
            if (Date.now() > decodedData.exp * 1000) {
                // clearing cookie
                res.clearCookie("access_token", {
                    secure: process.env.NODE_ENV === "development" ? false : true,
                    httpOnly: true,
                    sameSite: "none",
                });
                throw new error_handler_middleware_1.CustomError("session expired access_token", 401);
            }
            const user = yield user_models_1.User.findById(decodedData._id);
            if (!user) {
                throw new error_handler_middleware_1.CustomError("Unauthorized, Access_token", 401);
            }
            if (role && !role.includes(decodedData.role)) {
                throw new error_handler_middleware_1.CustomError("forbidden, Access denied", 403);
            }
            req.user = {
                _id: decodedData._id,
                email: decodedData.email,
                role: decodedData.role,
                first_name: decodedData.first_name,
                last_name: decodedData.last_name,
            };
            // role -> roles.includes(userRole)
            next();
        }
        catch (error) {
            next(error);
        }
    });
};
exports.authenticate = authenticate;
