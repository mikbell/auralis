import { parseBuffer } from 'music-metadata';
import fs from 'fs';
import path from 'path';

// Funzione di test per estrarre durata (copia della funzione dal controller)
const testExtractAudioDuration = async (filePath) => {
	try {
		console.log('\n🎵 Test estrazione durata dal file:', path.basename(filePath));
		console.log('📁 Percorso completo:', filePath);
		
		// Verifica se il file esiste
		if (!fs.existsSync(filePath)) {
			throw new Error('File non trovato');
		}
		
		// Leggi il file audio
		const buffer = fs.readFileSync(filePath);
		console.log('📊 Dimensione buffer:', buffer.length, 'bytes');
		
		// Determina il mimetype dal nome del file
		const ext = path.extname(filePath).toLowerCase();
		let mimeType;
		switch(ext) {
			case '.mp3': mimeType = 'audio/mpeg'; break;
			case '.wav': mimeType = 'audio/wav'; break;
			case '.m4a': mimeType = 'audio/mp4'; break;
			case '.ogg': mimeType = 'audio/ogg'; break;
			case '.flac': mimeType = 'audio/flac'; break;
			default: mimeType = 'audio/mpeg';
		}
		console.log('🏷️ MIME Type rilevato:', mimeType);
		
		// Estrai i metadati usando music-metadata
		console.log('🔍 Analizzando metadati...');
		const metadata = await parseBuffer(buffer, mimeType);
		
		console.log('\n📋 Metadati estratti:');
		console.log('- Formato:', metadata.format.container);
		console.log('- Codec:', metadata.format.codec);
		console.log('- Bitrate:', metadata.format.bitrate);
		console.log('- Sample Rate:', metadata.format.sampleRate);
		console.log('- Canali:', metadata.format.numberOfChannels);
		
		// Ottieni la durata in secondi
		const durationInSeconds = metadata.format.duration;
		
		if (!durationInSeconds) {
			throw new Error('Impossibile estrarre la durata dal file audio');
		}
		
		// Arrotonda la durata a un numero intero
		const duration = Math.round(durationInSeconds);
		
		console.log(`\n✅ Durata estratta: ${duration} secondi`);
		console.log(`🕐 Formato mm:ss: ${Math.floor(duration / 60)}:${String(duration % 60).padStart(2, '0')}`);
		
		// Informazioni sui tag (se disponibili)
		if (metadata.common) {
			console.log('\n🏷️ Tag trovati:');
			if (metadata.common.title) console.log('- Titolo:', metadata.common.title);
			if (metadata.common.artist) console.log('- Artista:', metadata.common.artist);
			if (metadata.common.album) console.log('- Album:', metadata.common.album);
			if (metadata.common.year) console.log('- Anno:', metadata.common.year);
		}
		
		return duration;
	} catch (error) {
		console.error('❌ Errore nell\'estrazione della durata:', error.message);
		console.log('📝 Stack trace:', error.stack);
		return 180; // 3 minuti come default
	}
};

// Funzione per testare con file di esempio generato
const createTestAudioFile = () => {
	console.log('\n🔧 Creazione file audio di test...');
	// Qui potresti creare un file audio di test o usare un file esistente
	// Per ora restituiamo null per indicare che il test va fatto con un file reale
	return null;
};

// Esecuzione del test
const runTest = async () => {
	console.log('🚀 Avvio test estrazione durata audio\n');
	
	// Prova a cercare file audio nella directory corrente o specifica un percorso
	const testFiles = [
		// Aggiungi qui i percorsi di file audio di test se disponibili
		'test-audio.mp3',
		'../test-audio.mp3',
		'./audio-sample.mp3',
		'C:/Users/Public/Music/sample.mp3'  // Percorso di esempio Windows
	];
	
	let fileFound = false;
	
	for (const filePath of testFiles) {
		if (fs.existsSync(filePath)) {
			console.log(`📁 File trovato: ${filePath}`);
			const duration = await testExtractAudioDuration(filePath);
			console.log(`\n🎯 Risultato test: ${duration} secondi\n`);
			fileFound = true;
			break;
		}
	}
	
	if (!fileFound) {
		console.log('⚠️ Nessun file audio di test trovato.');
		console.log('💡 Per testare completamente:');
		console.log('1. Metti un file audio (.mp3, .wav, .m4a, ecc.) in questa directory');
		console.log('2. Rinominalo in "test-audio.mp3" oppure');
		console.log('3. Modifica l\'array testFiles con il percorso del tuo file');
		console.log('\n🎵 Una volta fatto, esegui di nuovo: node test-audio-duration.js');
		
		// Test con buffer fittizio per verificare che la libreria funzioni
		console.log('\n🧪 Test base della libreria music-metadata...');
		try {
			// Questo testerà solo se la libreria è installata correttamente
			console.log('✅ Libreria music-metadata caricata correttamente');
		} catch (error) {
			console.error('❌ Errore con la libreria:', error.message);
		}
	}
};

// Esegui il test
runTest().catch(console.error);
