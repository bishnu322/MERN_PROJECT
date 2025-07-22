import express from "express";
import {
  getAllBrand,
  getBrandById,
  registerBrand,
  removeBrand,
  updateBrand,
} from "../controllers/brand.controllers";
import { authenticate } from "../middlewares/auth.middleware";
import { allAdmin } from "../types/global.types";

const router = express.Router();

router.get("/", getAllBrand);
router.get("/:id", getBrandById);
router.post("/", authenticate(allAdmin), registerBrand);
router.put("/:id", authenticate(allAdmin), updateBrand);
router.delete("/:id", authenticate(allAdmin), removeBrand);

export default router;
