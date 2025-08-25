import fetch from 'node-fetch';
import FormData from 'form-data';
import fs from 'fs';

// Script di test per creare una canzone
async function testCreateSong() {
    try {
        // Dovrai sostituire questi con il tuo token Clerk e file reali
        const clerkToken = 'YOUR_CLERK_TOKEN_HERE';
        
        const formData = new FormData();
        formData.append('title', 'Test Song');
        formData.append('artist', 'Test Artist');
        formData.append('duration', '180'); // 3 minuti in secondi
        
        // Per i file, dovresti usare file reali
        // formData.append('audioFile', fs.createReadStream('path/to/audio.mp3'));
        // formData.append('imageFile', fs.createReadStream('path/to/image.jpg'));
        
        const response = await fetch('http://localhost:5000/api/admin/songs', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${clerkToken}`,
                // Non impostare Content-Type per form-data, sarà impostato automaticamente
            },
            body: formData
        });
        
        const result = await response.json();
        console.log('Response Status:', response.status);
        console.log('Response Body:', result);
        
    } catch (error) {
        console.error('Error testing create song:', error);
    }
}

testCreateSong();
