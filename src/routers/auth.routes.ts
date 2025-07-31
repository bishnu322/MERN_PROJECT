import express from "express";
import {
  changePassword,
  login,
  registerUser,
} from "../controllers/auth.controllers";

const router = express.Router();

router.post("/login", login);
router.post("/register", registerUser);
router.post("/:id", changePassword);

export default router;
