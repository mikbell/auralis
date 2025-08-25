import { body, param, query, validationResult } from 'express-validator';

// Generic validation error handler
export const handleValidationErrors = (req, res, next) => {
	const errors = validationResult(req);
	if (!errors.isEmpty()) {
		return res.status(400).json({
			success: false,
			message: 'Validation errors',
			errors: errors.array().map(error => ({
				field: error.path,
				message: error.msg,
				value: error.value
			}))
		});
	}
	next();
};

// Song validation rules
export const validateSong = [
	body('title')
		.notEmpty()
		.withMessage('Song title is required')
		.isLength({ max: 100 })
		.withMessage('Title cannot exceed 100 characters')
		.trim(),
	body('artist')
		.notEmpty()
		.withMessage('Artist name is required')
		.isLength({ max: 50 })
		.withMessage('Artist name cannot exceed 50 characters')
		.trim(),
	body('duration')
		.isInt({ min: 1 })
		.withMessage('Duration must be a positive integer'),
	body('genre')
		.optional()
		.isIn(['pop', 'rock', 'hip-hop', 'jazz', 'classical', 'electronic', 'country', 'r&b', 'indie', 'other'])
		.withMessage('Invalid genre'),
	handleValidationErrors
];

// Album validation rules
export const validateAlbum = [
	body('title')
		.notEmpty()
		.withMessage('Album title is required')
		.isLength({ max: 100 })
		.withMessage('Title cannot exceed 100 characters')
		.trim(),
	body('artist')
		.notEmpty()
		.withMessage('Artist name is required')
		.isLength({ max: 50 })
		.withMessage('Artist name cannot exceed 50 characters')
		.trim(),
	body('description')
		.optional()
		.isLength({ max: 500 })
		.withMessage('Description cannot exceed 500 characters')
		.trim(),
	body('releaseYear')
		.optional()
		.isInt({ min: 1900, max: new Date().getFullYear() })
		.withMessage(`Release year must be between 1900 and ${new Date().getFullYear()}`),
	body('genre')
		.optional()
		.isIn(['pop', 'rock', 'hip-hop', 'jazz', 'classical', 'electronic', 'country', 'r&b', 'indie', 'other'])
		.withMessage('Invalid genre'),
	handleValidationErrors
];

// Pagination validation
export const validatePagination = [
	query('page')
		.optional()
		.isInt({ min: 1 })
		.withMessage('Page must be a positive integer'),
	query('limit')
		.optional()
		.isInt({ min: 1, max: 100 })
		.withMessage('Limit must be between 1 and 100'),
	handleValidationErrors
];

// MongoDB ObjectId validation
export const validateObjectId = (paramName = 'id') => [
	param(paramName)
		.isMongoId()
		.withMessage('Invalid ID format'),
	handleValidationErrors
];
