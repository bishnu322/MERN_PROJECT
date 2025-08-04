import express from "express";
import {
  cancel,
  createOrder,
  getAllOrders,
  getAllUserByOrder,
  getOrderStatus,
} from "../controllers/order.controller";
import { authenticate } from "../middlewares/auth.middleware";
import { allAdmin, users } from "../types/global.types";

const router = express.Router();

router.post("/", authenticate(users), createOrder);
router.get("/all", authenticate(allAdmin), getAllOrders);
router.get("/", authenticate(users), getAllUserByOrder);
router.put("/", authenticate(allAdmin), getOrderStatus);
router.put("/cancel", authenticate(allAdmin), cancel);

export default router;
