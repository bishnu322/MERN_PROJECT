import express from "express";
import {
  getAllBrand,
  getBrandById,
  registerBrand,
  removeBrand,
  updateBrand,
} from "../controllers/brand.controllers";

const router = express.Router();

router.get("/", getAllBrand);
router.post("/", registerBrand);
router.get("/:id", getBrandById);
router.put("/:id", updateBrand);
router.delete("/:id", removeBrand);

export default router;
