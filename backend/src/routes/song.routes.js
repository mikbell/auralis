import express from "express";
import {
	getAllSongs,
	getFeaturedSongs,
	getMadeForYouSongs,
	getTrendingSongs,
	getSongById,
	incrementPlayCount,
	searchMusic,
	quickSearch
} from "../controllers/song.controller.js";
import { protectRoute, requireAdmin } from "../middlewares/auth.middleware.js";
import { validatePagination, validateObjectId } from "../middlewares/validation.middleware.js";

const router = express.Router();

// Admin routes (must come before param routes)
router.get("/", protectRoute, requireAdmin, ...validatePagination, getAllSongs);

// Public routes
router.get("/search", searchMusic);
router.get("/search/quick", quickSearch);
router.get("/featured", getFeaturedSongs);
router.get("/made-for-you", getMadeForYouSongs);
router.get("/trending", getTrendingSongs);
router.get("/:id", ...validateObjectId('id'), getSongById);
router.post("/:id/play", ...validateObjectId('id'), incrementPlayCount);

export default router;
