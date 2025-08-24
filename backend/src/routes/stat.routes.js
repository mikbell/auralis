import express from "express";
import { getStats } from "../controllers/stat.controller.js";
import { protectRoute, requireAdmin } from "../middlewares/auth.middleware.js";
const router = express.Router();

router.get("/", protectRoute, requireAdmin, getStats);

export default router;
