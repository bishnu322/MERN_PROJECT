import express from "express";
import { authenticate } from "../middlewares/auth.middleware";
import { users } from "../types/global.types";
import { createCart, getCart } from "../controllers/cart.controller";

const router = express.Router();

router.post("/", authenticate(users), createCart);
router.get("/", authenticate(users), getCart);

export default router;
