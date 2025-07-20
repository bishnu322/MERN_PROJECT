import express from "express";
import {
  getAllProduct,
  getProductById,
  registerProduct,
  removeProduct,
  updateProduct,
} from "../controllers/product.controllers";

const router = express.Router();

router.post("/", registerProduct);
router.get("/", getAllProduct);
router.get("/:id", getProductById);
router.put("/:id", updateProduct);
router.delete("/:id", removeProduct);

export default router;
