# Spotify Clone - Backend

Backend Node.js/Express per l'applicazione Spotify Clone con MongoDB e autenticazione Clerk.

## 🚀 Avvio Rapido

```bash
# Installa dipendenze
npm install

# Avvia in modalità sviluppo
npm run dev

# Avvia in produzione
npm start
```

## 📋 Script Disponibili

### Sviluppo e Produzione
- `npm run dev` - Avvia il server in modalità sviluppo con nodemon
- `npm start` - Avvia il server in modalità produzione

### Database e Seeding
- `npm run seed` - Popola il database con dati di test (ATTENZIONE: cancella dati esistenti)
- `npm run seed:check` - Controlla lo stato del database e chiede conferma prima del seeding
- `npm run db:check` - Testa la connessione al database MongoDB
- `npm run db:clean-indexes` - Rimuove indici obsoleti dal database

### Testing e Health Check
- `npm run health` - Verifica che il server sia attivo e raggiungibile
- `npm run test:api` - Testa tutti gli endpoint API (richiede server attivo)

### Legacy (da migrare)
- `npm run seed:songs` - Script di seeding vecchio per canzoni
- `npm run seed:albums` - Script di seeding vecchio per album

## 🗄️ Struttura Database

Il database contiene le seguenti collezioni principali:

### Songs
- `title` - Titolo della canzone
- `artist` - Nome dell'artista
- `imageUrl` - URL dell'immagine di copertina
- `audioUrl` - URL del file audio
- `duration` - Durata in secondi
- `genre` - Genere musicale
- `playCount` - Numero di riproduzioni
- `likedBy` - Array di ID utenti che hanno messo "mi piace"
- `isActive` - Se la canzone è attiva
- `albumId` - Riferimento all'album (opzionale)

### Albums
- `title` - Titolo dell'album
- `artist` - Nome dell'artista
- `imageUrl` - URL dell'immagine di copertina
- `description` - Descrizione dell'album
- `releaseYear` - Anno di rilascio
- `genre` - Genere musicale
- `songs` - Array di ID delle canzoni nell'album

### Users (gestiti da Clerk)
- `clerkId` - ID univoco da Clerk
- `fullName` - Nome completo
- `imageUrl` - URL dell'avatar

## 🔧 Configurazione

Crea un file `.env` nella root del progetto con:

```env
PORT=5000
MONGODB_URI=mongodb+srv://user:password@cluster.mongodb.net/spotify
CLOUDINARY_API_KEY=your_cloudinary_key
CLOUDINARY_API_SECRET=your_cloudinary_secret  
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
CLERK_SECRET_KEY=your_clerk_secret_key
NODE_ENV=development
ADMIN_EMAIL=your_admin_email
```

## 🛠️ Funzionalità Principali

### Autenticazione
- Integrazione completa con Clerk
- Middleware di autenticazione per tutte le API
- Gestione automatica degli utenti

### API Endpoints
- **GET /api/songs** - Lista tutte le canzoni
- **GET /api/songs/:id** - Dettagli canzone specifica
- **GET /api/songs/featured** - Canzoni in evidenza
- **GET /api/songs/trending** - Canzoni di tendenza
- **GET /api/albums** - Lista tutti gli album
- **GET /api/albums/:id** - Dettagli album specifico
- **GET /api/stats** - Statistiche generali
- **POST /api/admin/songs** - Carica nuova canzone (solo admin)
- **POST /api/admin/albums** - Crea nuovo album (solo admin)

### Upload File
- Integrazione con Cloudinary per audio e immagini
- Validazione automatica dei file
- Ottimizzazione e conversione automatica

### Socket.IO
- Comunicazione real-time per chat e notifiche
- Gestione delle sessioni utente
- Sincronizzazione stato tra client

## 🔍 Testing e Debugging

### Verifica Stato Sistema
```bash
# Controlla se il server risponde
npm run health

# Testa connessione database
npm run db:check

# Stato attuale del database
npm run seed:check
```

### Popolamento Dati di Test
```bash
# Popola con dati di esempio (ATTENZIONE: cancella dati esistenti)
npm run seed

# Controlla prima di popolare
npm run seed:check
```

### Risoluzione Problemi Comuni

**Errore "address already in use"**
```bash
# Trova processo sulla porta 5000
netstat -ano | findstr :5000
# Termina il processo
taskkill /PID <PID_NUMBER> /F
```

**Errore indici duplicati MongoDB**
```bash
# Pulisci indici obsoleti
npm run db:clean-indexes
```

**Problemi di connessione MongoDB**
```bash
# Testa connessione
npm run db:check
```

## 📁 Struttura File

```
backend/
├── src/
│   ├── controllers/     # Logica business API
│   ├── lib/            # Configurazioni (database, cloudinary)
│   ├── middleware/     # Middleware Express
│   ├── models/         # Schemi MongoDB/Mongoose
│   ├── routes/         # Definizione rotte API
│   ├── scripts/        # Script di utilità e testing
│   ├── seeds/          # Script di seeding legacy
│   ├── utils/          # Funzioni di utilità
│   └── index.js        # Entry point applicazione
├── .env               # Variabili d'ambiente (non committare)
├── .gitignore        # File da escludere da git
├── package.json      # Dipendenze e script
└── README.md         # Questa documentazione
```

## 🎵 Dati di Test

Gli script di seeding includono canzoni italiane famose:
- Bella Ciao - Modena City Ramblers
- Azzurro - Adriano Celentano  
- Nel blu dipinto di blu - Domenico Modugno
- Con te partirò - Andrea Bocelli
- Laura non c'è - Nek
- Caruso - Lucio Dalla

E due album di esempio:
- Grandi Successi Italiani
- Musica Classica Italiana

## 🚨 Note di Sicurezza

- Tutte le API richiedono autenticazione Clerk
- I dati sensibili sono in variabili d'ambiente
- Rate limiting implementato su tutte le rotte
- Validazione input con express-validator
- Headers di sicurezza con helmet

## 📝 Log e Monitoring

Il server logga automaticamente:
- Connessioni database
- Richieste API con timestamp
- Errori e eccezioni
- Operazioni di upload file
- Connessioni Socket.IO

## 🤝 Contribuire

1. Crea un branch per la tua feature
2. Testa le modifiche con `npm run health`
3. Verifica che il seeding funzioni con `npm run seed:check`
4. Aggiorna questa documentazione se necessario
