import express from "express";
import { getAll, getById, removeUser } from "../controllers/user.controllers";

const router = express.Router();

router.get("/", getAll);
router.get("/:id", getById);
router.delete("/:id", removeUser);
// router.post("/:id", updateUser);

export default router;
