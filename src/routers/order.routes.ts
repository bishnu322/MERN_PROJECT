import express from "express";
import { authenticate } from "../middlewares/auth.middleware";
import { allAdmin, users } from "../types/global.types";
import {
  cancel,
  createOrder,
  getAll,
  getAllByUser,
  updateStatus,
} from "../controllers/order.controller";

const router = express.Router();

router.post("/", authenticate(users), createOrder);
router.get("/all", authenticate(allAdmin), getAll);
router.get("/", authenticate(users), getAllByUser);
router.put("/", authenticate(allAdmin), updateStatus);
router.put("/cancel", authenticate(users), cancel);

export default router;
