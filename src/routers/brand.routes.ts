import express from "express";
import {
  getAllBrand,
  getBrandById,
  registerBrand,
  removeBrand,
} from "../controllers/brand.controllers";

const router = express.Router();

router.get("/", getAllBrand);
router.get("/:id", getBrandById);
router.post("/registerBrand", registerBrand);
router.delete("/:id", removeBrand);

export default router;
