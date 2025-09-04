import express from "express";
import {
  addToWishLit,
  clearWishList,
  getWishList,
  removeWishlist,
} from "../controllers/wishlist.controller";
import { authenticate } from "../middlewares/auth.middleware";
import { allAdminAndUser, users } from "../types/global.types";

const router = express.Router();

router.post("/", authenticate(allAdminAndUser), addToWishLit);
router.get("/", authenticate(allAdminAndUser), getWishList);
router.delete("/remove", authenticate(allAdminAndUser), removeWishlist);
router.post("/clear", authenticate(allAdminAndUser), clearWishList);

export default router;
