import { Song } from "../models/song.model.js";
import { Album } from "../models/album.model.js";
import cloudinary from "../lib/cloudinary.js";
import { parseBuffer } from 'music-metadata';
import fs from 'fs';

// Funzione per estrarre la durata dal file audio
const extractAudioDuration = async (audioFile) => {
	try {
		console.log('🎵 Estraendo durata dal file audio:', audioFile.name);
		
		// Leggi il file audio dal percorso temporaneo
		const buffer = fs.readFileSync(audioFile.tempFilePath);
		
		// Estrai i metadati usando music-metadata
		const metadata = await parseBuffer(buffer, audioFile.mimetype);
		
		// Ottieni la durata in secondi
		const durationInSeconds = metadata.format.duration;
		
		if (!durationInSeconds) {
			throw new Error('Impossibile estrarre la durata dal file audio');
		}
		
		// Arrotonda la durata a un numero intero
		const duration = Math.round(durationInSeconds);
		
		console.log(`✅ Durata estratta: ${duration} secondi (${Math.floor(duration / 60)}:${String(duration % 60).padStart(2, '0')})`);
		
		return duration;
	} catch (error) {
		console.error('❌ Errore nell\'estrazione della durata:', error.message);
		// Se non riusciamo a estrarre la durata, restituiamo un valore di default
		return 180; // 3 minuti come default
	}
};

const uploadToCloudinary = async (file) => {
	try {
		console.log('📤 Uploading file to Cloudinary:', {
			fileName: file.name,
			fileSize: file.size,
			mimeType: file.mimetype,
			tempFilePath: file.tempFilePath
		});
		
		// Determina il resource_type e le opzioni in base al tipo di file
		const isAudio = file.mimetype.startsWith('audio/');
		const isVideo = file.mimetype.startsWith('video/');
		const isImage = file.mimetype.startsWith('image/');
		
		let uploadOptions;
		
		if (isAudio) {
			// Configurazione per file audio - usa 'raw' resource type
			uploadOptions = {
				resource_type: "raw", // I file audio devono usare 'raw' resource type
				public_id: `spotify_clone/audio_${Date.now()}_${file.name.replace(/\.[^/.]+$/, "")}`
			};
		} else if (isImage) {
			// Configurazione per immagini
			uploadOptions = {
				resource_type: "image",
				public_id: `spotify_clone/image_${Date.now()}_${file.name.replace(/\.[^/.]+$/, "")}`,
				transformation: [
					{ width: 800, height: 800, crop: "limit", quality: "auto:best" }
				],
				format: "jpg" // Forza formato specifico invece di auto
			};
		} else {
			// Configurazione generica per altri file
			uploadOptions = {
				resource_type: "auto",
				public_id: `spotify_clone/file_${Date.now()}_${file.name.replace(/\.[^/.]+$/, "")}`
			};
		}
		
		console.log('📋 Upload options:', uploadOptions);
		
		const result = await cloudinary.uploader.upload(file.tempFilePath, uploadOptions);
		
		console.log('✅ File uploaded successfully to Cloudinary:', result.secure_url);
		return result.secure_url;
	} catch (error) {
		console.error("🔥 Errore in uploadToCloudinary:", {
			error: error.message,
			stack: error.stack,
			fileName: file?.name,
			cloudinaryConfig: {
				cloud_name: process.env.CLOUDINARY_CLOUD_NAME ? 'Set' : 'Missing',
				api_key: process.env.CLOUDINARY_API_KEY ? 'Set' : 'Missing',
				api_secret: process.env.CLOUDINARY_API_SECRET ? 'Set' : 'Missing'
			}
		});
		throw new Error(`Cloudinary upload failed: ${error.message}`);
	}
};

export const createSong = async (req, res, next) => {
	try {
	if (!req.files || !req.files.audioFile || !req.files.imageFile) {
		return res.status(400).json({ message: "Per favore carica tutti i file" });
	}

		const { title, artist, albumId } = req.body;
		const audioFile = req.files.audioFile;
		const imageFile = req.files.imageFile;

		console.log('🎯 Avvio processo di creazione canzone:', { title, artist, albumId });

		// Estrai la durata automaticamente dal file audio
		const extractedDuration = await extractAudioDuration(audioFile);

		// Carica i file su Cloudinary
		const audioUrl = await uploadToCloudinary(audioFile);
		const imageUrl = await uploadToCloudinary(imageFile);

		const song = new Song({
			title,
			artist,
			audioUrl,
			imageUrl,
			duration: extractedDuration, // Usa la durata estratta automaticamente
			albumId: albumId || null,
		});

		console.log('💾 Salvando canzone con durata:', extractedDuration, 'secondi');
		await song.save();

	if (albumId) {
		await Album.findByIdAndUpdate(albumId, {
			$push: { songs: song._id },
		});
	}

		res.status(201).json(song);
	} catch (error) {
		console.log("Errore in createSong", error);
		next(error);
	}
};

export const deleteSong = async (req, res, next) => {
	try {
		const { id } = req.params;

		const song = await Song.findById(id);

		if (song.albumId) {
			await Album.findByIdAndUpdate(song.albumId, {
				$pull: { songs: song._id },
			});
		}

		await Song.findByIdAndDelete(id);

		res.status(200).json({ message: "Brano eliminato con successo" });
	} catch (error) {
		console.log("Errore in deleteSong", error);
		next(error);
	}
};

export const createAlbum = async (req, res, next) => {
	try {
		const { title, artist, releaseYear } = req.body;
		const { imageFile } = req.files;

		const imageUrl = await uploadToCloudinary(imageFile);
		const album = new Album({
			title,
			artist,
			imageUrl,
			releaseYear,
		});

	await album.save();

		res.status(201).json(album);
	} catch (error) {
		console.log("Errore in createAlbum", error);
		next(error);
	}
};

export const deleteAlbum = async (req, res, next) => {
	try {
		const { id } = req.params;
		await Song.deleteMany({ albumId: id });
		await Album.findByIdAndDelete(id);
		res.status(200).json({ message: "Album eliminato con successo" });
	} catch (error) {
		console.log("Errore in deleteAlbum");
		next(error);
	}
};

export const checkAdmin = (req, res, next) => {
	res.status(200).json({ admin: true });
};
