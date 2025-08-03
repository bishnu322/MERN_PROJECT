import express from "express";
import { getAll, getById, removeUser } from "../controllers/user.controller";
import { allAdmin } from "../types/global.types";
import { authenticate } from "../middlewares/auth.middleware";

const router = express.Router();

router.get("/:id", getById);
router.get("/", authenticate(allAdmin), getAll);
router.delete("/:id", authenticate(allAdmin), removeUser);
// router.post("/:id", updateUser);

export default router;
