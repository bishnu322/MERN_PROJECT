"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_middleware_1 = require("../middlewares/auth.middleware");
const global_types_1 = require("../types/global.types");
const order_controller_1 = require("../controllers/order.controller");
const router = express_1.default.Router();
router.post("/", (0, auth_middleware_1.authenticate)(global_types_1.allAdminAndUser), order_controller_1.createOrder);
router.get("/all", (0, auth_middleware_1.authenticate)(global_types_1.allAdmin), order_controller_1.getAll);
router.get("/", (0, auth_middleware_1.authenticate)(global_types_1.allAdminAndUser), order_controller_1.getAllByUser);
router.put("/", (0, auth_middleware_1.authenticate)(global_types_1.allAdmin), order_controller_1.updateStatus);
router.put("/cancel", (0, auth_middleware_1.authenticate)(global_types_1.users), order_controller_1.cancel);
exports.default = router;
