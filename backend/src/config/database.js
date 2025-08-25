import { Song } from '../models/song.model.js';
import { Album } from '../models/album.model.js';
import { User } from '../models/user.model.js';

// Create database indexes for better performance
export const createDatabaseIndexes = async () => {
	try {
		console.log('Creating database indexes...');

		// Song indexes
		await Song.collection.createIndex({ title: 'text', artist: 'text' }); // Text search
		await Song.collection.createIndex({ genre: 1 }); // Genre filter
		await Song.collection.createIndex({ artist: 1 }); // Artist filter
		await Song.collection.createIndex({ isActive: 1 }); // Active songs
		await Song.collection.createIndex({ playCount: -1 }); // Trending songs
		await Song.collection.createIndex({ createdAt: -1 }); // Latest songs
		await Song.collection.createIndex({ albumId: 1 }); // Album relationship

		// Album indexes
		await Album.collection.createIndex({ title: 'text', artist: 'text' }); // Text search
		await Album.collection.createIndex({ artist: 1 }); // Artist filter
		await Album.collection.createIndex({ genre: 1 }); // Genre filter
		await Album.collection.createIndex({ isActive: 1 }); // Active albums
		await Album.collection.createIndex({ releaseYear: -1 }); // Release year

		// User indexes (if User model exists)
		if (User) {
			await User.collection.createIndex({ clerkId: 1 }, { unique: true }); // Clerk user ID
			await User.collection.createIndex({ email: 1 }, { unique: true, sparse: true }); // Email
			await User.collection.createIndex({ createdAt: -1 }); // Registration date
		}

		// Compound indexes for common queries
		await Song.collection.createIndex({ isActive: 1, genre: 1, createdAt: -1 });
		await Song.collection.createIndex({ isActive: 1, playCount: -1 });
		await Album.collection.createIndex({ isActive: 1, artist: 1, releaseYear: -1 });

		console.log('Database indexes created successfully');
	} catch (error) {
		console.error('Error creating database indexes:', error);
	}
};
