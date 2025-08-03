import express from "express";
import {
  createOrder,
  getAllOrders,
  getAllUserByOrder,
  getOrderStatus,
} from "../controllers/order.controller";

const router = express.Router();

router.post("/", createOrder);
router.get("/", getAllOrders);
router.get("/user/", getAllUserByOrder);
router.get("/status/", getOrderStatus);

export default router;
