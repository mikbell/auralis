import dotenv from 'dotenv';
import { v2 as cloudinary } from 'cloudinary';
import fs from 'fs';

// Carica le variabili di ambiente
dotenv.config();

// Configura Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

async function testAudioUpload() {
  console.log('🎵 Testing Audio Upload to Cloudinary...');
  
  try {
    // Crea un file fittizio che simula un MP3
    const dummyAudioContent = Buffer.from('ID3' + 'x'.repeat(1000)); // Header MP3 fittizio
    const testFilePath = './test-audio.mp3';
    fs.writeFileSync(testFilePath, dummyAudioContent);
    
    console.log('📤 Testing upload with simulated MP3 file...');
    
    // Test le diverse configurazioni che potremmo usare
    const configs = [
      {
        name: 'Basic video resource_type',
        options: {
          resource_type: 'video',
          public_id: `spotify_test/audio_${Date.now()}`
        }
      },
      {
        name: 'Auto resource_type',
        options: {
          resource_type: 'auto',
          public_id: `spotify_test/auto_${Date.now()}`
        }
      },
      {
        name: 'Raw resource_type',
        options: {
          resource_type: 'raw',
          public_id: `spotify_test/raw_${Date.now()}`
        }
      }
    ];
    
    for (const config of configs) {
      console.log(`\n🧪 Testing: ${config.name}`);
      console.log('   Options:', JSON.stringify(config.options, null, 2));
      
      try {
        const result = await cloudinary.uploader.upload(testFilePath, config.options);
        console.log(`   ✅ SUCCESS: ${result.secure_url}`);
        console.log(`   📊 Details: ${result.resource_type} | ${result.format} | ${result.bytes} bytes`);
      } catch (error) {
        console.log(`   ❌ FAILED: ${error.message}`);
      }
    }
    
    // Pulisci il file di test
    fs.unlinkSync(testFilePath);
    
  } catch (error) {
    console.error('💥 Test setup failed:', error.message);
    
    // Pulisci in caso di errore
    try {
      fs.unlinkSync('./test-audio.mp3');
    } catch {}
  }
}

// Esegui il test
testAudioUpload().then(() => {
  console.log('\n🏁 Test completed!');
}).catch(err => {
  console.error('💥 Test crashed:', err);
});
