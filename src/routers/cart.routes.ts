import express from "express";
import { authenticate } from "../middlewares/auth.middleware";
import { users } from "../types/global.types";
import { createCart } from "../controllers/cart.controllers";

const router = express.Router();

router.post("/", authenticate(users), createCart);

export default router;
