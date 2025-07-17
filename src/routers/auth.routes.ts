import express from "express";
import {
  changePassword,
  login,
  registerUser,
} from "../controllers/auth.controllers";

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", login);
// router.post("/forgetPassword", forgetPassword);
router.post("/changePassword", changePassword);

export default router;
