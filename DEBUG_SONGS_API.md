# 🐛 Debug: Problemi con l'API di Creazione Brani

## 📋 Checklist per Risolvere i Problemi

### 1. **Verifica Autenticazione Admin**
- Assicurati di essere loggato con l'email: `mcampanello01@gmail.com`
- L'API richiede che l'utente sia autenticato con Clerk e sia admin

### 2. **Formato della Richiesta**
L'endpoint `/api/admin/songs` richiede:

```javascript
// Headers richiesti
{
  'Content-Type': 'multipart/form-data',
  'Authorization': 'Bearer <clerk-token>'
}

// Campi richiesti nel form-data
{
  title: "Nome del brano",
  artist: "Nome artista", 
  duration: "180", // durata in secondi
  audioFile: File, // file audio (.mp3, .wav, etc.)
  imageFile: File, // immagine di copertina (.jpg, .png, etc.)
  albumId: "optional-album-id" // opzionale
}
```

### 3. **Problemi Comuni e Soluzioni**

#### ❌ **Errore 401: Non autorizzato**
```json
{ "message": "Non autorizzato - devi accedere" }
```
**Soluzione**: Assicurati di includere il token Clerk nell'header Authorization

#### ❌ **Errore 403: Admin richiesto**
```json
{ "message": "Non autorizzato - devi essere admin" }
```
**Soluzione**: Verifica che l'email dell'account corrisponda a `ADMIN_EMAIL` nel .env

#### ❌ **Errore 400: File mancanti**
```json
{ "message": "Per favore carica tutti i file" }
```
**Soluzione**: Assicurati di includere sia `audioFile` che `imageFile` nel form-data

#### ❌ **Errore di Cloudinary**
```json
{ "message": "Errore nel caricamento su Cloudinary" }
```
**Soluzione**: Verifica le credenziali Cloudinary nel .env:
- `CLOUDINARY_CLOUD_NAME`
- `CLOUDINARY_API_KEY` 
- `CLOUDINARY_API_SECRET`

### 4. **Test con cURL**

```bash
# Test con cURL (sostituisci i valori)
curl -X POST http://localhost:5000/api/admin/songs \
  -H "Authorization: Bearer YOUR_CLERK_TOKEN" \
  -F "title=Test Song" \
  -F "artist=Test Artist" \
  -F "duration=180" \
  -F "audioFile=@/path/to/audio.mp3" \
  -F "imageFile=@/path/to/image.jpg"
```

### 5. **Test con JavaScript (Frontend)**

```javascript
// Esempio di uso dall'interfaccia React
const uploadSong = async (songData, audioFile, imageFile) => {
  const formData = new FormData();
  formData.append('title', songData.title);
  formData.append('artist', songData.artist);
  formData.append('duration', songData.duration);
  formData.append('audioFile', audioFile);
  formData.append('imageFile', imageFile);
  
  if (songData.albumId) {
    formData.append('albumId', songData.albumId);
  }
  
  try {
    const response = await fetch('/api/admin/songs', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${await getClerkToken()}`,
        // NON includere Content-Type, sarà impostato automaticamente
      },
      body: formData
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Errore caricamento brano:', error);
    throw error;
  }
};
```

### 6. **Controllo Log del Server**

Controlla i log del server per vedere errori dettagliati:
- Errori di autenticazione
- Problemi con Cloudinary
- Errori di validazione MongoDB

### 7. **Formati File Supportati**

**Audio**: .mp3, .wav, .m4a, .ogg
**Immagini**: .jpg, .jpeg, .png, .webp
**Limite**: 10MB per file

## 🔍 Come Debuggare

1. **Testa l'endpoint di health**: `GET /api/health`
2. **Testa l'autenticazione admin**: `GET /api/admin/check`
3. **Verifica le credenziali Cloudinary**
4. **Controlla i log del server per errori specifici**
5. **Testa con file di piccole dimensioni inizialmente**

## ⚠️ Note Importanti

- Il server deve essere in esecuzione sulla porta 5000
- MongoDB deve essere connesso
- Le credenziali Cloudinary devono essere valide
- L'utente deve essere autenticato come admin
- I file devono essere in formato supportato e sotto il limite di dimensione
