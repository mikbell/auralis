import mongoose from 'mongoose';
import dotenv from 'dotenv';

// Carica variabili d'ambiente
dotenv.config();

console.log('🧪 Test connessione database...');
console.log('MONGODB_URI:', process.env.MONGODB_URI ? 'Configurato' : 'NON configurato');

const testConnection = async () => {
	try {
		console.log('🔌 Tentativo di connessione...');
		
		const conn = await mongoose.connect(process.env.MONGODB_URI);
		console.log('✅ Connesso a MongoDB:', conn.connection.host);
		
		// Test semplice query
		const collections = await mongoose.connection.db.listCollections().toArray();
		console.log('📚 Collezioni trovate:', collections.map(c => c.name));
		
	} catch (error) {
		console.error('❌ Errore connessione:', error.message);
		process.exit(1);
	} finally {
		await mongoose.disconnect();
		console.log('🔌 Disconnesso');
	}
};

testConnection();
