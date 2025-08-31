import express from "express";
import {
  changePassword,
  login,
  logout,
  profile,
  registerUser,
} from "../controllers/auth.controller";
import { authenticate } from "../middlewares/auth.middleware";
import { allAdminAndUser } from "../types/global.types";

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", login);
router.post("/logout", logout);
router.get("/me", authenticate(allAdminAndUser), profile);
router.post("/:id", authenticate(allAdminAndUser), changePassword);

export default router;
