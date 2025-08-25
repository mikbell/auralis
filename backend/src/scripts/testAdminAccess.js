import fetch from 'node-fetch';
import dotenv from 'dotenv';

dotenv.config();

const BASE_URL = process.env.API_BASE_URL || 'http://localhost:5000';

/**
 * Script per testare l'accesso admin
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
	title: (msg) => console.log(`\n${colors.bold}${colors.blue}🔐 ${msg}${colors.reset}`)
};

const testAdminAccess = async () => {
	log.title('Test Accesso Admin - Spotify Clone');
	console.log(`🌐 URL Base: ${BASE_URL}`);
	console.log(`📧 Admin Email Configurata: ${process.env.ADMIN_EMAIL}\n`);

	try {
		// Test 1: Endpoint senza autenticazione
		log.info('Test 1: Tentativo accesso admin senza autenticazione...');
		try {
			const response = await fetch(`${BASE_URL}/api/admin/check`);
			const data = await response.json();
			
			if (response.status === 401) {
				log.success('Endpoint protetto correttamente (401 senza auth)');
				log.info(`Messaggio: ${data.message}`);
			} else {
				log.warning(`Status inaspettato: ${response.status}`);
			}
		} catch (error) {
			log.error(`Errore nel test 1: ${error.message}`);
		}

		// Test 2: Controllo configurazione Clerk
		log.info('\nTest 2: Controllo configurazione Clerk...');
		
		const clerkPubKey = process.env.CLERK_PUBLISHABLE_KEY;
		const clerkSecretKey = process.env.CLERK_SECRET_KEY;
		
		if (clerkPubKey && clerkSecretKey) {
			log.success('Chiavi Clerk configurate');
			log.info(`Publishable Key: ${clerkPubKey.substring(0, 20)}...`);
			log.info(`Secret Key: ${clerkSecretKey.substring(0, 20)}...`);
		} else {
			log.error('Chiavi Clerk mancanti nel file .env');
		}

		// Test 3: Controllo configurazione admin email
		log.info('\nTest 3: Controllo configurazione admin...');
		
		if (process.env.ADMIN_EMAIL) {
			log.success(`Email admin configurata: ${process.env.ADMIN_EMAIL}`);
		} else {
			log.error('ADMIN_EMAIL non configurata nel file .env');
		}

		// Test 4: Test endpoint pubblici
		log.info('\nTest 4: Test endpoint pubblici correlati...');
		
		try {
			const healthResponse = await fetch(`${BASE_URL}/api/health`);
			if (healthResponse.ok) {
				log.success('Endpoint health funzionante');
			}
		} catch (error) {
			log.warning('Endpoint health non disponibile');
		}

		// Informazioni per l'utente
		log.title('Istruzioni per Accesso Admin');
		console.log('Per accedere alla dashboard admin:');
		console.log('1. 🔑 Accedi all\'applicazione con l\'account:', process.env.ADMIN_EMAIL);
		console.log('2. 🌐 Naviga su: http://localhost:5173/admin');
		console.log('3. ✅ Se l\'email corrisponde, dovresti vedere la dashboard');
		console.log('\nSe non funziona:');
		console.log('- Verifica che l\'email usata per il login corrisponda a ADMIN_EMAIL');
		console.log('- Controlla la console del browser per errori JavaScript');
		console.log('- Verifica che il server backend sia in esecuzione sulla porta 5000');

	} catch (error) {
		log.error(`Errore generale nel test: ${error.message}`);
	}
};

testAdminAccess();
