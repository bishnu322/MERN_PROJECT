import express from "express";
import {
  getAllCategory,
  getCategoryById,
  registerCategory,
  removeCategory,
  updateCategory,
} from "../controllers/category.controllers";
import { authenticate } from "../middlewares/auth.middleware";
import { allAdmin } from "../types/global.types";

const router = express.Router();

router.get("/", getAllCategory);
router.get("/:id", getCategoryById);
router.post("/", authenticate(allAdmin), registerCategory);
router.put("/:id", authenticate(allAdmin), updateCategory);
router.delete("/:id", authenticate(allAdmin), removeCategory);

export default router;
