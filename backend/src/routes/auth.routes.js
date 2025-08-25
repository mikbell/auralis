import express from "express";
import { callback, getUserInfo } from "../controllers/auth.controller.js";
import { protectRoute } from "../middlewares/auth.middleware.js";
const router = express.Router();

router.post("/callback", callback);
router.get("/me", protectRoute, getUserInfo);

export default router;
