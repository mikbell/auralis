import express from "express";
import { callback } from "../controllers/auth.controller.js";
const router = express.Router();

router.post("/callback", callback);

export default router;
