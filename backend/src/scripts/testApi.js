import fetch from 'node-fetch';

const BASE_URL = process.env.API_BASE_URL || 'http://localhost:5000/api';

/**
 * Script per testare le API del backend
 * Utilizzo: node src/scripts/testApi.js
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
	title: (msg) => console.log(`\n${colors.bold}${colors.blue}🧪 ${msg}${colors.reset}`)
};

// Helper per eseguire richieste HTTP
const makeRequest = async (endpoint, options = {}) => {
	try {
		const url = `${BASE_URL}${endpoint}`;
		log.info(`Richiesta: ${options.method || 'GET'} ${url}`);
		
		const response = await fetch(url, {
			headers: {
				'Content-Type': 'application/json',
				...options.headers
			},
			...options
		});

		const data = await response.json();
		
		if (!response.ok) {
			throw new Error(`HTTP ${response.status}: ${data.message || 'Errore sconosciuto'}`);
		}

		return { status: response.status, data };
	} catch (error) {
		throw new Error(`Errore richiesta: ${error.message}`);
	}
};

// Test delle API
const tests = {
	// Test API Canzoni
	async testSongsApi() {
		log.title('Test API Canzoni');

		try {
			// GET /api/songs
			const { data: songsData } = await makeRequest('/songs');
			const songs = songsData.data || songsData;
			log.success(`Trovate ${songs.length} canzoni`);
			
			if (songs.length > 0) {
				const firstSong = songs[0];
				log.info(`Prima canzone: "${firstSong.title}" di ${firstSong.artist}`);
				
				// GET /api/songs/:id
				const { data: songDetail } = await makeRequest(`/songs/${firstSong._id}`);
				const song = songDetail.data || songDetail;
				log.success(`Dettaglio canzone: "${song.title}"`);
			} else {
				log.warning('Nessuna canzone trovata - considera di eseguire il seeding');
			}

		} catch (error) {
			log.error(`Test canzoni fallito: ${error.message}`);
		}
	},

	// Test API Album
	async testAlbumsApi() {
		log.title('Test API Album');

		try {
			// GET /api/albums
			const { data: albumsData } = await makeRequest('/albums');
			const albums = albumsData.data || albumsData;
			log.success(`Trovati ${albums.length} album`);

			if (albums.length > 0) {
				const firstAlbum = albums[0];
				log.info(`Primo album: "${firstAlbum.title}" di ${firstAlbum.artist}`);
				
				// GET /api/albums/:id
				const { data: albumDetail } = await makeRequest(`/albums/${firstAlbum._id}`);
				const album = albumDetail.data || albumDetail;
				log.success(`Dettaglio album: "${album.title}"`);
			} else {
				log.warning('Nessun album trovato - considera di eseguire il seeding');
			}

		} catch (error) {
			log.error(`Test album fallito: ${error.message}`);
		}
	},

	// Test API Stats
	async testStatsApi() {
		log.title('Test API Statistiche');

		try {
			// GET /api/stats
			const { data: stats } = await makeRequest('/stats');
			log.success('Statistiche ottenute:');
			console.log(`   📊 Canzoni totali: ${stats.totalSongs}`);
			console.log(`   📀 Album totali: ${stats.totalAlbums}`);
			console.log(`   👥 Artisti unici: ${stats.totalArtists}`);
			console.log(`   🎧 Ascolti totali: ${stats.totalPlays}`);

		} catch (error) {
			log.error(`Test stats fallito: ${error.message}`);
		}
	},

	// Test API Featured
	async testFeaturedApi() {
		log.title('Test API Contenuti in Evidenza');

		try {
			// GET /api/songs/featured
			const { data: featuredData } = await makeRequest('/songs/featured');
			const featured = featuredData.data || featuredData;
			log.success(`Trovate ${featured.length} canzoni in evidenza`);

			// GET /api/songs/trending
			const { data: trendingData } = await makeRequest('/songs/trending');
			const trending = trendingData.data || trendingData;
			log.success(`Trovate ${trending.length} canzoni di tendenza`);

		} catch (error) {
			log.error(`Test featured/trending fallito: ${error.message}`);
		}
	},

	// Test connettività server
	async testServerHealth() {
		log.title('Test Stato Server');

		try {
			const response = await fetch(BASE_URL.replace('/api', '/health'));
			if (response.ok) {
				log.success('Server raggiungibile e funzionante');
			} else {
				log.warning(`Server risponde ma con status: ${response.status}`);
			}
		} catch (error) {
			log.error(`Server non raggiungibile: ${error.message}`);
		}
	}
};

// Esegui tutti i test
const runAllTests = async () => {
	console.log(`${colors.bold}${colors.blue}🧪 Test API Backend - Spotify Clone${colors.reset}`);
	console.log(`🌐 URL Base: ${BASE_URL}\n`);

	const testFunctions = [
		tests.testServerHealth,
		tests.testStatsApi,
		tests.testSongsApi, 
		tests.testAlbumsApi,
		tests.testFeaturedApi
	];

	let passed = 0;
	let failed = 0;

	for (const testFn of testFunctions) {
		try {
			await testFn();
			passed++;
		} catch (error) {
			log.error(`Test fallito: ${error.message}`);
			failed++;
		}
		
		// Pausa tra i test
		await new Promise(resolve => setTimeout(resolve, 500));
	}

	// Risultati finali
	console.log(`\n${colors.bold}📋 Risultati Test:${colors.reset}`);
	console.log(`${colors.green}   ✅ Passati: ${passed}${colors.reset}`);
	console.log(`${colors.red}   ❌ Falliti: ${failed}${colors.reset}`);
	
	if (failed === 0) {
		log.success('Tutti i test sono passati! 🎉');
	} else {
		log.warning('Alcuni test sono falliti - controlla il backend');
	}
};

// Esegui se chiamato direttamente
if (process.argv[1] === new URL(import.meta.url).pathname.replace(/\\/g, '/')) {
	runAllTests().catch(error => {
		log.error(`Errore durante l'esecuzione dei test: ${error.message}`);
		process.exit(1);
	});
}

export { runAllTests, tests };
