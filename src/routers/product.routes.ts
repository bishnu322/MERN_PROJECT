import express from "express";
import {
  getAllProduct,
  getFeaturedProduct,
  getProductByBrand,
  getProductByCategory,
  getProductById,
  registerProduct,
  removeProduct,
  updateProduct,
} from "../controllers/product.controller";
import { authenticate } from "../middlewares/auth.middleware";
import { allAdmin, allAdminAndUser } from "../types/global.types";
import { uploader } from "../middlewares/uploader.middleware";

const router = express.Router();

const upload = uploader();

router.get("/featuredProduct", getFeaturedProduct);
router.get("/brand/:brandId", getProductByBrand);
router.get("/category/:categoryId", getProductByCategory);
router.get("/", getAllProduct);
router.get("/:id", getProductById);

router.post(
  "/",
  authenticate(allAdmin),
  upload.fields([
    { name: "cover_img", maxCount: 1 },
    { name: "images", maxCount: 5 },
  ]),
  registerProduct
);

router.put(
  "/:id",
  authenticate(allAdminAndUser),
  upload.fields([
    { name: "cover_img", maxCount: 1 },
    { name: "images", maxCount: 5 },
  ]),
  updateProduct
);

router.delete("/:id", authenticate(allAdmin), removeProduct);

export default router;
