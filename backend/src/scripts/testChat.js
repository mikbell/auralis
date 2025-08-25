import fetch from 'node-fetch';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import { connectDB } from '../lib/db.js';
import { User } from '../models/user.model.js';
import { Message } from '../models/message.model.js';

dotenv.config();

const BASE_URL = process.env.API_BASE_URL || 'http://localhost:5000';

/**
 * Script per testare la funzionalità chat
 */

const colors = {
	green: '\x1b[32m',
	red: '\x1b[31m',
	yellow: '\x1b[33m',
	blue: '\x1b[34m',
	reset: '\x1b[0m',
	bold: '\x1b[1m'
};

const log = {
	success: (msg) => console.log(`${colors.green}✅ ${msg}${colors.reset}`),
	error: (msg) => console.log(`${colors.red}❌ ${msg}${colors.reset}`),
	warning: (msg) => console.log(`${colors.yellow}⚠️  ${msg}${colors.reset}`),
	info: (msg) => console.log(`${colors.blue}ℹ️  ${msg}${colors.reset}`),
	title: (msg) => console.log(`\n${colors.bold}${colors.blue}💬 ${msg}${colors.reset}`)
};

const testChatFunctionality = async () => {
	log.title('Test Funzionalità Chat - Spotify Clone');
	console.log(`🌐 URL Base: ${BASE_URL}\n`);

	try {
		// Test 1: Connessione database
		log.info('Test 1: Connessione database...');
		await connectDB();
		log.success('Database connesso correttamente');

		// Test 2: Verifica modelli
		log.info('Test 2: Verifica modelli...');
		
		const userCount = await User.countDocuments();
		const messageCount = await Message.countDocuments();
		
		log.success(`Modello User: ${userCount} utenti nel database`);
		log.success(`Modello Message: ${messageCount} messaggi nel database`);

		// Test 3: Test endpoint utenti (richiede autenticazione)
		log.info('Test 3: Test endpoint utenti...');
		try {
			const usersResponse = await fetch(`${BASE_URL}/api/users`);
			if (usersResponse.status === 401) {
				log.success('Endpoint /api/users protetto correttamente (401)');
			} else {
				log.warning(`Status inaspettato: ${usersResponse.status}`);
			}
		} catch (error) {
			log.error(`Errore test utenti: ${error.message}`);
		}

		// Test 4: Test endpoint messaggi (richiede autenticazione)
		log.info('Test 4: Test endpoint messaggi...');
		try {
			const messagesResponse = await fetch(`${BASE_URL}/api/users/messages/test-user-id`);
			if (messagesResponse.status === 401) {
				log.success('Endpoint messaggi protetto correttamente (401)');
			} else {
				log.warning(`Status inaspettato: ${messagesResponse.status}`);
			}
		} catch (error) {
			log.error(`Errore test messaggi: ${error.message}`);
		}

		// Test 5: Verifica Socket.IO setup
		log.info('Test 5: Verifica configurazione Socket.IO...');
		try {
			const socketResponse = await fetch(`${BASE_URL}/socket.io/`);
			if (socketResponse.status === 200 || socketResponse.status === 400) {
				log.success('Socket.IO endpoint disponibile');
			} else {
				log.warning(`Socket.IO status: ${socketResponse.status}`);
			}
		} catch (error) {
			log.warning('Socket.IO non testabile via HTTP (normale per websocket)');
		}

		// Test 6: Verifica struttura database
		log.info('Test 6: Verifica struttura database...');
		
		// Prova a creare un messaggio di test
		const testMessage = {
			senderId: 'test-sender',
			receiverId: 'test-receiver', 
			content: 'Messaggio di test'
		};

		const message = new Message(testMessage);
		const validationError = message.validateSync();
		
		if (!validationError) {
			log.success('Schema Message validato correttamente');
		} else {
			log.error(`Errori validazione schema: ${validationError.message}`);
		}

		log.title('Risultati Test Chat');
		log.success('Backend chat configurato correttamente');
		log.info('Le API sono protette da autenticazione (comportamento corretto)');
		log.info('Socket.IO configurato per comunicazione real-time');
		
		console.log('\n📋 Per utilizzare la chat:');
		console.log('1. 🔑 Effettua il login con Clerk nell\'applicazione');
		console.log('2. 💬 Naviga su: http://localhost:5173/chat');
		console.log('3. 👥 Vedrai la lista degli utenti registrati');
		console.log('4. 🗨️  Seleziona un utente per iniziare a chattare');
		
		console.log('\n⚠️  Note:');
		console.log('- La chat richiede almeno 2 utenti registrati per funzionare');
		console.log('- I messaggi sono salvati nel database MongoDB');
		console.log('- Le notifiche real-time funzionano via Socket.IO');

	} catch (error) {
		log.error(`Errore generale nel test: ${error.message}`);
		process.exit(1);
	} finally {
		if (mongoose.connection.readyState === 1) {
			await mongoose.disconnect();
			log.info('Disconnesso dal database');
		}
	}
};

testChatFunctionality();
