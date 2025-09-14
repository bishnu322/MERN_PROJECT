import express from "express";
import {
  getAllBrand,
  getBrandById,
  registerBrand,
  removeBrand,
  updateBrand,
} from "../controllers/brand.controller";
import { authenticate } from "../middlewares/auth.middleware";
import { allAdmin, allAdminAndUser } from "../types/global.types";
import { uploader } from "../middlewares/uploader.middleware";

const router = express.Router();

const upload = uploader();

router.get("/", getAllBrand);
router.get("/:id", getBrandById);
router.post(
  "/",

  upload.single("logo"),
  registerBrand
);
router.put("/:id", authenticate(allAdmin), upload.single("logo"), updateBrand);
router.delete("/:id", authenticate(allAdmin), removeBrand);

export default router;
