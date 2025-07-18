import express from "express";
import {
  getAllCategory,
  getCategoryById,
  registerCategory,
  removeCategory,
  updateCategory,
} from "../controllers/category.controllers";

const router = express.Router();

router.get("/", getAllCategory);
router.post("/", registerCategory);
router.get("/:id", getCategoryById);
router.put("/:id", updateCategory);
router.delete("/:id", removeCategory);

export default router;
