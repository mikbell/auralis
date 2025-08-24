import express from "express";
import {
	checkAdmin,
	createSong,
	deleteSong,
	createAlbum,
	deleteAlbum,
} from "../controllers/admin.controller.js";
import { protectRoute, requireAdmin } from "../middlewares/auth.middleware.js";
const router = express.Router();

router.use(protectRoute, requireAdmin);

router.get("/check", checkAdmin);

router.post("/songs", createSong);
router.delete("/songs/:id", deleteSong);

router.post("/albums", createAlbum);
router.delete("/albums/:id", deleteAlbum);

export default router;
