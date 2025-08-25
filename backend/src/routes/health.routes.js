import express from 'express';
import mongoose from 'mongoose';
import { apiResponse } from '../utils/apiResponse.js';

const router = express.Router();

// Health check endpoint
router.get('/', async (req, res) => {
	try {
		// Check database connection
		const dbState = mongoose.connection.readyState;
		const dbStatus = dbState === 1 ? 'connected' : 'disconnected';
		
		// Get basic system info
		const healthInfo = {
			status: 'healthy',
			timestamp: new Date().toISOString(),
			uptime: Math.floor(process.uptime()),
			environment: process.env.NODE_ENV || 'development',
			version: process.env.npm_package_version || '1.0.0',
			database: {
				status: dbStatus,
				readyState: dbState
			},
			memory: {
				used: Math.round(process.memoryUsage().heapUsed / 1024 / 1024),
				total: Math.round(process.memoryUsage().heapTotal / 1024 / 1024)
			}
		};

		// If database is not connected, mark as unhealthy
		if (dbState !== 1) {
			healthInfo.status = 'unhealthy';
			return apiResponse.error(res, 'Database not connected', 503, healthInfo);
		}

		return apiResponse.success(res, healthInfo, 'Service is healthy');
	} catch (error) {
		console.error('Health check failed:', error);
		return apiResponse.error(res, 'Health check failed', 503, {
			status: 'unhealthy',
			timestamp: new Date().toISOString(),
			error: error.message
		});
	}
});

// Detailed health check for admin
router.get('/detailed', async (req, res) => {
	try {
		const healthInfo = {
			status: 'healthy',
			timestamp: new Date().toISOString(),
			uptime: Math.floor(process.uptime()),
			environment: process.env.NODE_ENV || 'development',
			version: process.env.npm_package_version || '1.0.0',
			system: {
				platform: process.platform,
				nodeVersion: process.version,
				cpuUsage: process.cpuUsage(),
				memory: process.memoryUsage()
			},
			database: {
				status: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected',
				readyState: mongoose.connection.readyState,
				host: mongoose.connection.host,
				name: mongoose.connection.name
			}
		};

		return apiResponse.success(res, healthInfo, 'Detailed health check');
	} catch (error) {
		console.error('Detailed health check failed:', error);
		return apiResponse.error(res, 'Detailed health check failed', 503);
	}
});

export default router;
