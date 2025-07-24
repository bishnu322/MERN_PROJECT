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
import { uploader } from "../middlewares/uploader.middleware";

const router = express.Router();

const upload = uploader();

router.get("/", getAllBrand);
router.get("/:id", getBrandById);
router.post("/", authenticate(allAdmin), upload.single("logo"), registerBrand);
router.put("/:id", authenticate(allAdmin), updateBrand);
router.delete("/:id", authenticate(allAdmin), removeBrand);

export default router;
