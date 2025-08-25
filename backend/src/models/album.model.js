import mongoose from "mongoose";

const albumSchema = new mongoose.Schema(
	{
		title: {
			type: String,
			required: [true, 'Album title is required'],
			trim: true,
			maxlength: [100, 'Album title cannot exceed 100 characters']
		},
		artist: {
			type: String,
			required: [true, 'Artist name is required'],
			trim: true,
			maxlength: [50, 'Artist name cannot exceed 50 characters']
		},
		imageUrl: {
			type: String,
			required: [true, 'Album cover image is required'],
			unique: true,
			match: [/^https?:\/\/.+/, 'Please provide a valid image URL']
		},
		description: {
			type: String,
			trim: true,
			maxlength: [500, 'Description cannot exceed 500 characters']
		},
		releaseYear: {
			type: Number,
			min: [1900, 'Release year must be after 1900'],
			max: [new Date().getFullYear(), 'Release year cannot be in the future']
		},
		genre: {
			type: String,
			enum: ['pop', 'rock', 'hip-hop', 'jazz', 'classical', 'electronic', 'country', 'r&b', 'indie', 'other'],
			default: 'other'
		},
		isActive: {
			type: Boolean,
			default: true
		},
		songs: [{ type: mongoose.Schema.Types.ObjectId, ref: "Song" }],
	},
	{ timestamps: true }
);

export const Album = mongoose.model("Album", albumSchema);
