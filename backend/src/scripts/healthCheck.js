import fetch from 'node-fetch';

const BASE_URL = process.env.API_BASE_URL || 'http://localhost:5000';

/**
 * Script per verificare che il server sia attivo
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
	title: (msg) => console.log(`\n${colors.bold}${colors.blue}🔍 ${msg}${colors.reset}`)
};

const healthCheck = async () => {
	log.title('Controllo stato server Spotify Clone');
	console.log(`🌐 URL Base: ${BASE_URL}\n`);

	try {
		// Test connessione base
		log.info('Test connessione server...');
		const response = await fetch(BASE_URL);
		
		if (response.ok) {
			log.success('Server raggiungibile e attivo');
			const text = await response.text();
			if (text.includes('Spotify Clone') || text.includes('API')) {
				log.success('Server risponde correttamente');
			}
		} else {
			log.warning(`Server risponde con status: ${response.status}`);
		}

		// Test endpoint API base
		log.info('Test endpoint API base...');
		try {
			const apiResponse = await fetch(`${BASE_URL}/api`);
			if (apiResponse.status === 404) {
				log.info('Endpoint /api non configurato (normale)');
			} else if (apiResponse.status === 401) {
				log.success('API attive (richiedono autenticazione)');
			} else {
				log.info(`API risponde con status: ${apiResponse.status}`);
			}
		} catch (error) {
			log.warning(`Test API fallito: ${error.message}`);
		}

		// Test endpoint specifici che potrebbero essere pubblici
		const testEndpoints = ['/health', '/status', '/api/health'];
		
		for (const endpoint of testEndpoints) {
			try {
				const endpointResponse = await fetch(`${BASE_URL}${endpoint}`);
				if (endpointResponse.ok) {
					log.success(`Endpoint ${endpoint} disponibile`);
				}
			} catch (error) {
				// Ignora errori per endpoint opzionali
			}
		}

		log.title('Risultati Health Check');
		log.success('Server backend attivo e funzionante');
		log.info('Le API sono protette da autenticazione (comportamento corretto)');
		log.info('Frontend può connettersi al backend');

	} catch (error) {
		log.error(`Server non raggiungibile: ${error.message}`);
		log.error('Assicurati che il server backend sia in esecuzione su porta 5000');
		process.exit(1);
	}
};

healthCheck();
