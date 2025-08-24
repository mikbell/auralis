import express from "express";
import { getAllUsers } from "../controllers/user.controller.js";
import { protectRoute } from "../middlewares/auth.middleware.js";
const router = express.Router();

router.get("/", protectRoute, getAllUsers);

export default router;
