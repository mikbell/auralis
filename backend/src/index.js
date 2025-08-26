import express from "express";
import dotenv from "dotenv";
import fs from "fs";
import { connectDB } from "./lib/db.js";
import { clerkMiddleware } from "@clerk/express";
import fileUpload from "express-fileupload";
import path from "path";
import cors from "cors";
import helmet from "helmet";
import compression from "compression";
import { createDatabaseIndexes } from "./config/database.js";
import { apiRateLimit } from "./middlewares/rateLimit.middleware.js";
import cron from "node-cron";

import userRoutes from "./routes/user.routes.js";
import authRoutes from "./routes/auth.routes.js";
import adminRoutes from "./routes/admin.routes.js";
import songRoutes from "./routes/song.routes.js";
import albumRoutes from "./routes/album.routes.js";
import statRoutes from "./routes/stat.routes.js";
import healthRoutes from "./routes/health.routes.js";
import { createServer } from "http";
import { initializeSocket } from "./lib/socket.js";

dotenv.config();

const app = express();
const __dirname = path.resolve();
const PORT = process.env.PORT || 5000;

const httpServer = createServer(app);
initializeSocket(httpServer);

// Security middleware
app.use(
	helmet({
		crossOriginEmbedderPolicy: false, // Allow embedding audio/video
	})
);

// Compression middleware
app.use(compression());

// Rate limiting
app.use("/api/", apiRateLimit);

// CORS configuration
app.use(
	cors({
		origin:
			process.env.NODE_ENV === "production"
				? process.env.CLIENT_URL?.split(",") || ["http://localhost:5173"]
				: ["http://localhost:5173", "http://localhost:3000"],
		credentials: true,
		optionsSuccessStatus: 200,
	})
);

// Body parsing middleware
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));
app.use(clerkMiddleware());
app.use(
	fileUpload({
		useTempFiles: true,
		tempFileDir: path.join(__dirname, "temp"),
		createParentPath: true,
		limits: {
			fileSize: 10 * 1024 * 1024,
		},
	})
);

const tempDir = path.join(process.cwd(), "temp");

cron.schedule("0 * * * *", () => {
	if (fs.existsSync(tempDir)) {
		fs.readdir(tempDir, (err, files) => {
			if (err) {
				console.error(err);
				return;
			}
			for (const file of files) {
				fs.unlink(path.join(tempDir, file), (err) => {});
			}
		});
	}
});

app.use("/api/health", healthRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/songs", songRoutes);
app.use("/api/albums", albumRoutes);
app.use("/api/stats", statRoutes);

// Temporary root route for backend-only deployment
app.get("/", (req, res) => {
	res.json({
		success: true,
		message: "Auralis Backend API is running",
		version: "1.0.0",
		environment: process.env.NODE_ENV || "development",
		api: {
			health: "/api/health",
			auth: "/api/auth",
			songs: "/api/songs",
			albums: "/api/albums",
			stats: "/api/stats",
			users: "/api/users",
			admin: "/api/admin"
		},
		timestamp: new Date().toISOString()
	});
});

// Serve frontend in production (when available)
if (process.env.NODE_ENV === "production" && process.env.SERVE_FRONTEND === "true") {
	try {
		const frontendPath = path.join(__dirname, "../../frontend/dist");
		if (fs.existsSync(frontendPath)) {
			app.use(express.static(frontendPath));
			app.get("*", (req, res) => {
				res.sendFile(path.resolve(frontendPath, "index.html"));
			});
		}
	} catch (error) {
		console.log("Frontend files not found, serving API only");
	}
}

app.use((err, req, res, next) => {
	res.status(500).json({
		message:
			process.env.NODE_ENV === "production"
				? "Errore interno del server"
				: err.message,
	});
});

httpServer.listen(PORT, async (req, res) => {
	console.log("Applicazione in ascolto sul port", PORT);
	await connectDB();

	// Create database indexes for better performance
	await createDatabaseIndexes();
});
