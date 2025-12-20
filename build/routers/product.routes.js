"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const product_controller_1 = require("../controllers/product.controller");
const auth_middleware_1 = require("../middlewares/auth.middleware");
const global_types_1 = require("../types/global.types");
const uploader_middleware_1 = require("../middlewares/uploader.middleware");
const router = express_1.default.Router();
const upload = (0, uploader_middleware_1.uploader)();
router.get("/featuredProduct", product_controller_1.getFeaturedProduct);
router.get("/", product_controller_1.getAllProduct);
router.get("/:id", product_controller_1.getProductById);
router.post("/", (0, auth_middleware_1.authenticate)(global_types_1.allAdmin), upload.fields([
    {
        name: "cover_img",
        maxCount: 1,
    },
    {
        name: "images",
        maxCount: 5,
    },
]), product_controller_1.registerProduct);
router.put("/:id", (0, auth_middleware_1.authenticate)(global_types_1.allAdminAndUser), upload.fields([
    {
        name: "cover_img",
        maxCount: 1,
    },
    {
        name: "images",
        maxCount: 5,
    },
]), product_controller_1.updateProduct);
router.delete("/:id", (0, auth_middleware_1.authenticate)(global_types_1.allAdmin), product_controller_1.removeProduct);
router.get("/brand/:brandId", product_controller_1.getProductByBrand);
router.get("/category/:categoryId", product_controller_1.getProductByCategory);
exports.default = router;
