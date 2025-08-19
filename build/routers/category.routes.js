"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const category_controller_1 = require("../controllers/category.controller");
const auth_middleware_1 = require("../middlewares/auth.middleware");
const global_types_1 = require("../types/global.types");
const router = express_1.default.Router();
router.get("/", category_controller_1.getAllCategory);
router.get("/:id", category_controller_1.getCategoryById);
router.post("/", (0, auth_middleware_1.authenticate)(global_types_1.allAdmin), category_controller_1.registerCategory);
router.put("/:id", (0, auth_middleware_1.authenticate)(global_types_1.allAdmin), category_controller_1.updateCategory);
router.delete("/:id", (0, auth_middleware_1.authenticate)(global_types_1.allAdmin), category_controller_1.removeCategory);
exports.default = router;
