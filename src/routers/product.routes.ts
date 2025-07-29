import express from "express";
import {
  getAllProduct,
  getProductByBrand,
  getProductByCategory,
  getProductById,
  registerProduct,
  removeProduct,
  updateProduct,
} from "../controllers/product.controllers";
import { authenticate } from "../middlewares/auth.middleware";
import { allAdmin } from "../types/global.types";
import { uploader } from "../middlewares/uploader.middleware";
import { getAllBrand } from "../controllers/brand.controllers";

const router = express.Router();

const upload = uploader();

router.get("/", getAllProduct);
router.get("/:id", getProductById);
router.post(
  "/",
  authenticate(allAdmin),
  upload.fields([
    {
      name: "cover_img",
      maxCount: 1,
    },
    {
      name: "images",
      maxCount: 5,
    },
  ]),
  registerProduct
);
router.put(
  "/:id",
  authenticate(allAdmin),
  upload.fields([
    {
      name: "cover_img",
      maxCount: 1,
    },
    {
      name: "images",
      maxCount: 5,
    },
  ]),
  updateProduct
);
router.delete("/:id", authenticate(allAdmin), removeProduct);
router.get("/brand/:brandId", getProductByBrand);
router.get("/category/:categoryId", getProductByCategory);

export default router;
