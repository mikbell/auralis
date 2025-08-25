import { Song } from "../models/song.model.js";
import { apiResponse, getPagination, asyncHandler } from "../utils/apiResponse.js";
import mongoose from "mongoose";

export const getAllSongs = asyncHandler(async (req, res) => {
	const { page, limit } = req.query;
	const { search, genre, artist } = req.query;
	const pagination = getPagination(page, limit);

	// Build query
	let query = { isActive: true };

	if (search) {
		query.$or = [
			{ title: { $regex: search, $options: 'i' } },
			{ artist: { $regex: search, $options: 'i' } }
		];
	}

	if (genre && genre !== 'all') {
		query.genre = genre;
	}

	if (artist) {
		query.artist = { $regex: artist, $options: 'i' };
	}

	// Execute query with pagination
	const [songs, total] = await Promise.all([
		Song.find(query)
			.select('-likedBy')
			.sort({ createdAt: -1 })
			.skip(pagination.skip)
			.limit(pagination.limit)
			.populate('albumId', 'title artist imageUrl'),
		Song.countDocuments(query)
	]);

	const paginationInfo = {
		...pagination,
		total
	};

	return apiResponse.paginated(res, songs, paginationInfo, 'Songs retrieved successfully');
});

export const getFeaturedSongs = asyncHandler(async (req, res) => {
	const songs = await Song.aggregate([
		{ $match: { isActive: true } },
		{ $sample: { size: 6 } },
		{
			$project: {
				_id: 1,
				title: 1,
				artist: 1,
				imageUrl: 1,
				audioUrl: 1,
				duration: 1,
				genre: 1
			}
		},
		{
			$lookup: {
				from: 'albums',
				localField: 'albumId',
				foreignField: '_id',
				as: 'album'
			}
		}
	]);

	return apiResponse.success(res, songs, 'Featured songs retrieved successfully');
});

export const getMadeForYouSongs = asyncHandler(async (req, res) => {
	// For now, we'll use random songs, but this could be based on user preferences
	const songs = await Song.aggregate([
		{ $match: { isActive: true } },
		{ $sample: { size: 4 } },
		{
			$project: {
				_id: 1,
				title: 1,
				artist: 1,
				imageUrl: 1,
				audioUrl: 1,
				duration: 1,
				genre: 1
			}
		}
	]);

	return apiResponse.success(res, songs, 'Made for you songs retrieved successfully');
});

export const getTrendingSongs = asyncHandler(async (req, res) => {
	// Get trending songs based on play count
	const songs = await Song.aggregate([
		{ $match: { isActive: true } },
		{ $sort: { playCount: -1, createdAt: -1 } },
		{ $limit: 6 },
		{
			$project: {
				_id: 1,
				title: 1,
				artist: 1,
				imageUrl: 1,
				audioUrl: 1,
				duration: 1,
				genre: 1,
				playCount: 1
			}
		}
	]);

	return apiResponse.success(res, songs, 'Trending songs retrieved successfully');
});

// Get single song by ID
export const getSongById = asyncHandler(async (req, res) => {
	const { id } = req.params;

	if (!mongoose.isValidObjectId(id)) {
		return apiResponse.error(res, 'Invalid song ID format', 400);
	}

	const song = await Song.findById(id)
		.populate('albumId', 'title artist imageUrl releaseYear')
		.select('-likedBy');

	if (!song || !song.isActive) {
		return apiResponse.notFound(res, 'Song');
	}

	return apiResponse.success(res, song, 'Song retrieved successfully');
});

// Advanced search for songs, albums, and artists
export const searchMusic = asyncHandler(async (req, res) => {
	const { q: query, type = 'all', genre, artist, limit = 20, offset = 0 } = req.query;

	if (!query || query.trim().length === 0) {
		return apiResponse.error(res, 'Search query is required', 400);
	}

	const searchRegex = new RegExp(query.trim(), 'i');
	const results = {
		songs: [],
		albums: [],
		artists: [],
		total: 0
	};

	const baseQuery = { isActive: true };

	// Build search conditions
	const songSearchConditions = {
		...baseQuery,
		$or: [
			{ title: searchRegex },
			{ artist: searchRegex }
		]
	};

	// Apply additional filters
	if (genre && genre !== 'all') {
		songSearchConditions.genre = genre;
	}

	if (artist) {
		songSearchConditions.artist = new RegExp(artist.trim(), 'i');
	}

	try {
		// Search songs
		if (type === 'all' || type === 'songs') {
			const songs = await Song.find(songSearchConditions)
				.select('-likedBy')
				.populate('albumId', 'title artist imageUrl')
				.sort({ playCount: -1, createdAt: -1 })
				.limit(parseInt(limit))
				.skip(parseInt(offset));

			results.songs = songs;
		}

		// Search albums (if Album model exists)
		if (type === 'all' || type === 'albums') {
			try {
				const { Album } = await import('../models/album.model.js');
				const albums = await Album.find({
					...baseQuery,
					$or: [
						{ title: searchRegex },
						{ artist: searchRegex }
					]
				})
				.limit(parseInt(limit))
				.skip(parseInt(offset));
				
				results.albums = albums;
			} catch (error) {
				// Album model might not exist, skip albums search
				console.log('Album model not found, skipping albums search');
			}
		}

		// Search artists (aggregate unique artists from songs)
		if (type === 'all' || type === 'artists') {
			const artists = await Song.aggregate([
				{ $match: { ...baseQuery, artist: searchRegex } },
				{
					$group: {
						_id: '$artist',
						artist: { $first: '$artist' },
						songCount: { $sum: 1 },
						totalPlays: { $sum: '$playCount' },
						imageUrl: { $first: '$imageUrl' }
					}
				},
				{ $sort: { totalPlays: -1 } },
				{ $limit: parseInt(limit) },
				{ $skip: parseInt(offset) }
			]);

			results.artists = artists;
		}

		// Calculate total results
		results.total = results.songs.length + results.albums.length + results.artists.length;

		return apiResponse.success(res, results, 'Search completed successfully');
	} catch (error) {
		console.error('Search error:', error);
		return apiResponse.error(res, 'Search failed', 500);
	}
});

// Quick search for autocomplete
export const quickSearch = asyncHandler(async (req, res) => {
	const { q: query, limit = 5 } = req.query;

	if (!query || query.trim().length < 2) {
		return apiResponse.success(res, { suggestions: [] }, 'Quick search results');
	}

	const searchRegex = new RegExp(query.trim(), 'i');

	try {
		// Get quick suggestions from songs and artists
		const [songSuggestions, artistSuggestions] = await Promise.all([
			// Song title suggestions
			Song.find(
				{ isActive: true, title: searchRegex },
				{ title: 1, artist: 1, imageUrl: 1 }
			)
			.sort({ playCount: -1 })
			.limit(parseInt(limit)),

			// Artist suggestions
			Song.aggregate([
				{ $match: { isActive: true, artist: searchRegex } },
				{
					$group: {
						_id: '$artist',
						artist: { $first: '$artist' },
						imageUrl: { $first: '$imageUrl' }
					}
				},
				{ $limit: parseInt(limit) }
			])
		]);

		const suggestions = [
			...songSuggestions.map(song => ({
				type: 'song',
				id: song._id,
				title: song.title,
				artist: song.artist,
				imageUrl: song.imageUrl
			})),
			...artistSuggestions.map(artist => ({
				type: 'artist',
				id: artist._id,
				title: artist.artist,
				artist: artist.artist,
				imageUrl: artist.imageUrl
			}))
		];

		return apiResponse.success(res, { suggestions }, 'Quick search completed');
	} catch (error) {
		console.error('Quick search error:', error);
		return apiResponse.error(res, 'Quick search failed', 500);
	}
});

// Increment play count
export const incrementPlayCount = asyncHandler(async (req, res) => {
	const { id } = req.params;

	if (!mongoose.isValidObjectId(id)) {
		return apiResponse.error(res, 'Invalid song ID format', 400);
	}

	const song = await Song.findByIdAndUpdate(
		id,
		{ $inc: { playCount: 1 } },
		{ new: true }
	);

	if (!song || !song.isActive) {
		return apiResponse.notFound(res, 'Song');
	}

	return apiResponse.success(res, { playCount: song.playCount }, 'Play count updated successfully');
});
