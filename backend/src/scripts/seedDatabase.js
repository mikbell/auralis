import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { connectDB } from '../lib/db.js';
import { seedDatabase, checkDatabaseStatus } from '../utils/testData.js';

// Carica variabili d'ambiente
dotenv.config();

/**
 * Script per popolare il database con dati di test
 * Utilizzo: node src/scripts/seedDatabase.js
 */

const runSeeding = async () => {
	try {
		console.log('🚀 Avvio script di seeding...\n');

		// Connetti al database
		await connectDB();
		console.log('✅ Connessione al database stabilita\n');

		// Controlla stato attuale
		console.log('📊 Controllo stato database...');
		await checkDatabaseStatus();
		console.log('');

		// Chiedi conferma prima di procedere
		const confirmation = process.argv.includes('--force') || 
			process.argv.includes('-f') ||
			process.env.NODE_ENV === 'development';

		if (!confirmation) {
			console.log('⚠️  Questo script cancellerà tutti i dati esistenti!');
			console.log('   Per procedere, aggiungi --force o -f come parametro');
			console.log('   Esempio: node src/scripts/seedDatabase.js --force');
			process.exit(0);
		}

		// Esegui il seeding
		await seedDatabase();
		
		console.log('\n🎯 Verifica finale...');
		await checkDatabaseStatus();

		console.log('\n✨ Seeding completato con successo!');
		console.log('   Puoi ora testare l\'applicazione con i dati di esempio');

	} catch (error) {
		console.error('\n❌ Errore durante il seeding:', error.message);
		console.error('Stack trace:', error.stack);
		process.exit(1);
	} finally {
		// Chiudi connessione
		if (mongoose.connection.readyState === 1) {
			await mongoose.disconnect();
			console.log('\n🔌 Disconnesso dal database');
		}
	}
};

// Gestione segnali per cleanup
process.on('SIGINT', async () => {
	console.log('\n⚡ Interruzione ricevuta, pulizia in corso...');
	if (mongoose.connection.readyState === 1) {
		await mongoose.disconnect();
	}
	process.exit(0);
});

process.on('SIGTERM', async () => {
	console.log('\n⚡ Terminazione ricevuta, pulizia in corso...');
	if (mongoose.connection.readyState === 1) {
		await mongoose.disconnect();
	}
	process.exit(0);
});

// Esegui lo script
runSeeding();
