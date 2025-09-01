import express from "express";
import { authenticate } from "../middlewares/auth.middleware";
import { allAdmin, users } from "../types/global.types";
import { createCart, getCart } from "../controllers/cart.controller";

const router = express.Router();

router.post("/", authenticate(allAdmin), createCart);
// router.get("/", authenticate(users), getCart);
router.get("/", authenticate(allAdmin), getCart);

export default router;
