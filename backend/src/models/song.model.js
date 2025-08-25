import mongoose from "mongoose";

const songSchema = new mongoose.Schema(
	{
		title: {
			type: String,
			required: true,
		},
		artist: {
			type: String,
			required: true,
		},
		imageUrl: {
			type: String,
			required: true,
		},
		audioUrl: {
			type: String,
			required: true,
		},
		duration: {
			type: Number,
			required: true,
			min: [1, 'Duration must be at least 1 second']
		},
		genre: {
			type: String,
			required: false,
			enum: ['pop', 'rock', 'hip-hop', 'jazz', 'classical', 'electronic', 'country', 'r&b', 'indie', 'folk', 'other'],
			default: 'other'
		},
		playCount: {
			type: Number,
			default: 0,
			min: 0
		},
		likedBy: [{
			type: mongoose.Schema.Types.ObjectId,
			ref: 'User'
		}],
		isActive: {
			type: Boolean,
			default: true
		},
		albumId: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "Album",
			required: false,
		},
	},
	{ timestamps: true }
);

export const Song = mongoose.model("Song", songSchema);
