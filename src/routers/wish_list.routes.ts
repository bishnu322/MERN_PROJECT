import express from "express";
import { addToWishLit, getWishList } from "../controllers/wishlist.controller";
import { authenticate } from "../middlewares/auth.middleware";
import { users } from "../types/global.types";

const router = express.Router();

router.post("/", authenticate(users), addToWishLit);
router.get("/", authenticate(users), getWishList);

export default router;
