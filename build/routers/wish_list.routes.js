"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const wishlist_controller_1 = require("../controllers/wishlist.controller");
const auth_middleware_1 = require("../middlewares/auth.middleware");
const global_types_1 = require("../types/global.types");
const router = express_1.default.Router();
router.post("/", (0, auth_middleware_1.authenticate)(global_types_1.allAdminAndUser), wishlist_controller_1.addToWishLit);
router.get("/", (0, auth_middleware_1.authenticate)(global_types_1.allAdminAndUser), wishlist_controller_1.getWishList);
router.delete("/remove", (0, auth_middleware_1.authenticate)(global_types_1.allAdminAndUser), wishlist_controller_1.removeWishlist);
router.post("/clear", (0, auth_middleware_1.authenticate)(global_types_1.allAdminAndUser), wishlist_controller_1.clearWishList);
exports.default = router;
