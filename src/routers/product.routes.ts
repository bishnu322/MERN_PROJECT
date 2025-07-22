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

const router = express.Router();

router.get("/", getAllProduct);
router.get("/:id", getProductById);
router.post("/", authenticate(allAdmin), registerProduct);
router.put("/:id", authenticate(allAdmin), updateProduct);
router.delete("/:id", authenticate(allAdmin), removeProduct);

export default router;
