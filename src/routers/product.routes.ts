import express from "express";
import {
  getAllProduct,
  getProductById,
  registerProduct,
  removeProduct,
  updateProduct,
} from "../controllers/product.controllers";
import { authenticate } from "../middlewares/auth.middleware";
import { allAdmin } from "../types/global.types";
import { uploader } from "../middlewares/uploader.middleware";

const router = express.Router();

const upload = uploader();

router.get("/", getAllProduct);
router.get("/:id", getProductById);
router.post(
  "/",
  authenticate(allAdmin),
  upload.single("product_logo"),
  registerProduct
);
router.put("/:id", authenticate(allAdmin), updateProduct);
router.delete("/:id", authenticate(allAdmin), removeProduct);

export default router;
