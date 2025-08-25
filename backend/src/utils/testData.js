import { Song } from '../models/song.model.js';
import { Album } from '../models/album.model.js';

// Dati di esempio per testare l'applicazione
export const sampleSongs = [
	{
		title: "Bella Ciao",
		artist: "Modena City Ramblers",
		imageUrl: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=300&h=300&fit=crop",
		audioUrl: "https://www.soundjay.com/misc/sounds/bell-ringing-05.wav",
		duration: 180,
		genre: "folk",
		playCount: 1250
	},
	{
		title: "Azzurro",
		artist: "Adriano Celentano", 
		imageUrl: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=300&h=300&fit=crop",
		audioUrl: "https://www.soundjay.com/misc/sounds/bell-ringing-05.wav",
		duration: 210,
		genre: "pop",
		playCount: 2100
	},
	{
		title: "Nel blu dipinto di blu",
		artist: "Domenico Modugno",
		imageUrl: "https://images.unsplash.com/photo-1445985543470-41fba5c3144a?w=300&h=300&fit=crop",
		audioUrl: "https://www.soundjay.com/misc/sounds/bell-ringing-05.wav", 
		duration: 195,
		genre: "pop",
		playCount: 3200
	},
	{
		title: "Con te partirò",
		artist: "Andrea Bocelli",
		imageUrl: "https://images.unsplash.com/photo-1516280440614-37939bbacd81?w=300&h=300&fit=crop",
		audioUrl: "https://www.soundjay.com/misc/sounds/bell-ringing-05.wav",
		duration: 240,
		genre: "classical", 
		playCount: 1800
	},
	{
		title: "Laura non c'è",
		artist: "Nek",
		imageUrl: "https://images.unsplash.com/photo-1571330735066-03aaa9429d89?w=300&h=300&fit=crop",
		audioUrl: "https://www.soundjay.com/misc/sounds/bell-ringing-05.wav",
		duration: 225,
		genre: "pop",
		playCount: 950
	},
	{
		title: "Caruso",
		artist: "Lucio Dalla",
		imageUrl: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=300&h=300&fit=crop",
		audioUrl: "https://www.soundjay.com/misc/sounds/bell-ringing-05.wav",
		duration: 275,
		genre: "pop",
		playCount: 2800
	}
];

export const sampleAlbums = [
	{
		title: "Grandi Successi Italiani",
		artist: "Vari Artisti",
		imageUrl: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=400&fit=crop",
		description: "Una collezione dei più grandi successi della musica italiana",
		releaseYear: 2020,
		genre: "pop"
	},
	{
		title: "Musica Classica Italiana", 
		artist: "Andrea Bocelli",
		imageUrl: "https://images.unsplash.com/photo-1516280440614-37939bbacd81?w=400&h=400&fit=crop",
		description: "Le più belle melodie della musica classica italiana",
		releaseYear: 2019,
		genre: "classical"
	}
];

// Funzione per popolare il database con dati di test
export const seedDatabase = async () => {
	try {
		console.log('🌱 Inizio popolazione database...');

		// Cancella i dati esistenti
		await Song.deleteMany({});
		await Album.deleteMany({});

		console.log('🗑️ Dati esistenti cancellati');

		// Inserisci album
		const albums = await Album.insertMany(sampleAlbums);
		console.log(`📀 ${albums.length} album inseriti`);

		// Inserisci canzoni
		const songs = await Song.insertMany(sampleSongs);
		console.log(`🎵 ${songs.length} canzoni inserite`);

		// Associa alcune canzoni agli album
		if (albums.length > 0 && songs.length > 0) {
			// Associa le prime 3 canzoni al primo album
			await Album.findByIdAndUpdate(
				albums[0]._id,
				{ $push: { songs: { $each: songs.slice(0, 3).map(s => s._id) } } }
			);

			// Associa le altre al secondo album
			if (albums[1]) {
				await Album.findByIdAndUpdate(
					albums[1]._id,
					{ $push: { songs: { $each: songs.slice(3).map(s => s._id) } } }
				);
			}

			console.log('🔗 Canzoni associate agli album');
		}

		console.log('✅ Database popolato con successo!');
		console.log(`📊 Totale: ${albums.length} album, ${songs.length} canzoni`);

	} catch (error) {
		console.error('❌ Errore durante la popolazione del database:', error);
		throw error;
	}
};

// Funzione per verificare lo stato del database
export const checkDatabaseStatus = async () => {
	try {
		const songCount = await Song.countDocuments();
		const albumCount = await Album.countDocuments();
		
		console.log('📊 Stato Database:');
		console.log(`   🎵 Canzoni: ${songCount}`);
		console.log(`   📀 Album: ${albumCount}`);

		if (songCount === 0 && albumCount === 0) {
			console.log('⚠️  Database vuoto - considera di eseguire il seeding');
		}

		return { songCount, albumCount };
	} catch (error) {
		console.error('❌ Errore nel controllo database:', error);
		throw error;
	}
};
