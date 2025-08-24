import Song from "../models/song.model.js";
import Album from "../models/album.model.js";

const uploadToCloudinary = async (file) => {
	try {
		const result = await uploadToCloudinary.uploader.upload(file.tempFilePath, {
			resource_type: "auto",
		});
		return result.secure_url;
	} catch (error) {
		console.log("Errore in uploadToCloudinary", error);
		throw new Error("Errore nel caricamento su Cloudinary");
	}
};

export const createSong = async (req, res, next) => {
	try {
		if (!req.files || !req.files.audioFile || !req.file.imageFile) {
			res.status(400).json({ message: "Per favore carica tutti i file" });
		}

		const { title, artist, albumId, duration } = req.body;
		const audioFile = req.files.audioFile;
		const imageFile = req.files.imageFile;

		const audioUrl = await uploadToCloudinary(audioFile);
		const imageUrl = await uploadToCloudinary(imageFile);

		const song = new Song({
			title,
			artist,
			audioUrl,
			imageUrl,
			duration,
			albumId: albumId || null,
		});

		await song.save();

		if (albumId) {
			await albumId.findByIdAndUpdate(albumId, {
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

		await Album.save();

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
