import express from "express";
import { addToWishLit, getWishList } from "../controllers/wishlist.controller";
import { authenticate } from "../middlewares/auth.middleware";
import { allAdminAndUser, users } from "../types/global.types";

const router = express.Router();

router.post("/", authenticate(allAdminAndUser), addToWishLit);
router.get("/", authenticate(allAdminAndUser), getWishList);

export default router;
