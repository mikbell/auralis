// Standard API response format
export const apiResponse = {
	success: (res, data, message = 'Success', statusCode = 200) => {
		return res.status(statusCode).json({
			success: true,
			message,
			data,
			timestamp: new Date().toISOString()
		});
	},

	error: (res, message = 'Internal server error', statusCode = 500, errors = null) => {
		return res.status(statusCode).json({
			success: false,
			message,
			errors,
			timestamp: new Date().toISOString()
		});
	},

	// Paginated response
	paginated: (res, data, pagination, message = 'Success', statusCode = 200) => {
		return res.status(statusCode).json({
			success: true,
			message,
			data,
			pagination: {
				...pagination,
				totalPages: Math.ceil(pagination.total / pagination.limit),
				hasNext: pagination.page < Math.ceil(pagination.total / pagination.limit),
				hasPrev: pagination.page > 1
			},
			timestamp: new Date().toISOString()
		});
	},

	// Not found response
	notFound: (res, resource = 'Resource') => {
		return res.status(404).json({
			success: false,
			message: `${resource} not found`,
			timestamp: new Date().toISOString()
		});
	},

	// Unauthorized response
	unauthorized: (res, message = 'Unauthorized access') => {
		return res.status(401).json({
			success: false,
			message,
			timestamp: new Date().toISOString()
		});
	},

	// Forbidden response
	forbidden: (res, message = 'Access forbidden') => {
		return res.status(403).json({
			success: false,
			message,
			timestamp: new Date().toISOString()
		});
	},

	// Validation error response
	validationError: (res, errors) => {
		return res.status(400).json({
			success: false,
			message: 'Validation failed',
			errors,
			timestamp: new Date().toISOString()
		});
	}
};

// Pagination helper
export const getPagination = (page = 1, limit = 10) => {
	const pageNum = Math.max(1, parseInt(page));
	const limitNum = Math.min(100, Math.max(1, parseInt(limit)));
	const skip = (pageNum - 1) * limitNum;

	return {
		page: pageNum,
		limit: limitNum,
		skip
	};
};

// Async handler wrapper to catch errors
export const asyncHandler = (fn) => {
	return (req, res, next) => {
		Promise.resolve(fn(req, res, next)).catch(next);
	};
};
