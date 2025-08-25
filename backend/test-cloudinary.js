import dotenv from 'dotenv';
import { v2 as cloudinary } from 'cloudinary';
import fs from 'fs';

// Carica le variabili di ambiente
dotenv.config();

console.log('🧪 Testing Cloudinary Configuration...');

// Verifica configurazione
console.log('📋 Environment Variables:');
console.log('  CLOUDINARY_CLOUD_NAME:', process.env.CLOUDINARY_CLOUD_NAME || 'MISSING');
console.log('  CLOUDINARY_API_KEY:', process.env.CLOUDINARY_API_KEY || 'MISSING');
console.log('  CLOUDINARY_API_SECRET:', process.env.CLOUDINARY_API_SECRET ? 'SET' : 'MISSING');

// Configura Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Test upload di un file di testo semplice
async function testUpload() {
  try {
    // Crea un file di test temporaneo
    const testContent = 'This is a test file for Cloudinary upload';
    const testFilePath = './test-file.txt';
    fs.writeFileSync(testFilePath, testContent);
    
    console.log('📤 Testing upload with simple text file...');
    
    // Test upload semplice
    const result = await cloudinary.uploader.upload(testFilePath, {
      resource_type: 'raw',
      public_id: `spotify_test/test_${Date.now()}`
    });
    
    console.log('✅ Upload successful!');
    console.log('📍 URL:', result.secure_url);
    console.log('📊 Details:', {
      public_id: result.public_id,
      resource_type: result.resource_type,
      format: result.format,
      bytes: result.bytes
    });
    
    // Pulisci il file di test
    fs.unlinkSync(testFilePath);
    
    return true;
  } catch (error) {
    console.error('❌ Upload failed:');
    console.error('  Error:', error.message);
    console.error('  Stack:', error.stack);
    
    // Pulisci il file di test in caso di errore
    try {
      fs.unlinkSync('./test-file.txt');
    } catch {}
    
    return false;
  }
}

// Esegui il test
testUpload().then(success => {
  if (success) {
    console.log('\n🎉 Cloudinary is working correctly!');
    console.log('The issue might be in the file processing or upload options.');
  } else {
    console.log('\n💥 Cloudinary configuration has issues.');
    console.log('Check your environment variables and Cloudinary account.');
  }
}).catch(err => {
  console.error('💥 Test failed:', err);
});
