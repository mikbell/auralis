import mongoose from 'mongoose';
import dotenv from 'dotenv';

// Carica variabili d'ambiente
dotenv.config();

const dropObsoleteIndexes = async () => {
	try {
		console.log('🔧 Connessione al database...');
		
		const conn = await mongoose.connect(process.env.MONGODB_URI);
		console.log('✅ Connesso a MongoDB:', conn.connection.host);
		
		const db = mongoose.connection.db;
		
		// Controlla indici esistenti per songs
		console.log('\n📊 Controllo indici esistenti per "songs"...');
		const songsIndexes = await db.collection('songs').indexes();
		console.log('Indici trovati:', songsIndexes.map(idx => ({ name: idx.name, key: idx.key })));
		
		// Rimuovi l'indice imageUrl_1 se esiste
		try {
			const imageUrlIndexExists = songsIndexes.some(idx => idx.name === 'imageUrl_1');
			if (imageUrlIndexExists) {
				console.log('🗑️ Rimozione indice imageUrl_1...');
				await db.collection('songs').dropIndex('imageUrl_1');
				console.log('✅ Indice imageUrl_1 rimosso con successo');
			} else {
				console.log('ℹ️ Indice imageUrl_1 non trovato, nessuna azione necessaria');
			}
		} catch (error) {
			if (error.code === 27 || error.codeName === 'IndexNotFound') {
				console.log('ℹ️ Indice imageUrl_1 non esiste');
			} else {
				throw error;
			}
		}
		
		// Controlla indici per albums
		console.log('\n📊 Controllo indici esistenti per "albums"...');
		const albumsIndexes = await db.collection('albums').indexes();
		console.log('Indici trovati:', albumsIndexes.map(idx => ({ name: idx.name, key: idx.key })));
		
		console.log('\n✅ Pulizia indici completata!');
		
	} catch (error) {
		console.error('❌ Errore durante la pulizia indici:', error.message);
		process.exit(1);
	} finally {
		await mongoose.disconnect();
		console.log('🔌 Disconnesso dal database');
	}
};

dropObsoleteIndexes();
