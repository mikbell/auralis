import rateLimit from 'express-rate-limit';

// General API rate limit
export const apiRateLimit = rateLimit({
	windowMs: 15 * 60 * 1000, // 15 minutes
	max: 1000, // limit each IP to 1000 requests per windowMs
	message: {
		success: false,
		message: 'Too many requests from this IP, please try again later.',
		timestamp: new Date().toISOString()
	},
	standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
	legacyHeaders: false, // Disable the `X-RateLimit-*` headers
});

// Stricter rate limit for authentication endpoints
export const authRateLimit = rateLimit({
	windowMs: 15 * 60 * 1000, // 15 minutes
	max: 5, // limit each IP to 5 requests per windowMs for auth
	message: {
		success: false,
		message: 'Too many authentication attempts, please try again later.',
		timestamp: new Date().toISOString()
	},
	standardHeaders: true,
	legacyHeaders: false,
});

// Upload rate limit
export const uploadRateLimit = rateLimit({
	windowMs: 60 * 60 * 1000, // 1 hour
	max: 10, // limit each IP to 10 uploads per hour
	message: {
		success: false,
		message: 'Too many upload attempts, please try again later.',
		timestamp: new Date().toISOString()
	},
	standardHeaders: true,
	legacyHeaders: false,
});

// Search rate limit
export const searchRateLimit = rateLimit({
	windowMs: 1 * 60 * 1000, // 1 minute
	max: 30, // limit each IP to 30 search requests per minute
	message: {
		success: false,
		message: 'Too many search requests, please slow down.',
		timestamp: new Date().toISOString()
	},
	standardHeaders: true,
	legacyHeaders: false,
});

// Play count update rate limit
export const playRateLimit = rateLimit({
	windowMs: 1 * 60 * 1000, // 1 minute
	max: 100, // limit each IP to 100 play updates per minute
	message: {
		success: false,
		message: 'Too many play requests, please slow down.',
		timestamp: new Date().toISOString()
	},
	standardHeaders: true,
	legacyHeaders: false,
});
