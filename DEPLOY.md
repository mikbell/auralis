# 🚀 Deploy su Render - Guida Completa

Questa guida ti aiuterà a deployare Auralis su Render utilizzando la configurazione automatica.

## 📋 Prerequisiti

### 1. Account e Servizi Esterni
- [ ] Account Render (render.com)
- [ ] Account Clerk per autenticazione
- [ ] Account Cloudinary per storage media
- [ ] Repository GitHub con il codice

### 2. Variabili d'Ambiente Necessarie
Copia `.env.example` e configura le seguenti variabili:

#### Clerk (Autenticazione)
```
CLERK_SECRET_KEY=sk_live_your_secret_key
VITE_CLERK_PUBLISHABLE_KEY=pk_live_your_publishable_key
```

#### Cloudinary (Storage Media)
```
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

## 🔧 Setup Automatico con render.yaml

Il progetto include un file `render.yaml` che configura automaticamente:
- **Backend API** (Node.js Web Service)
- **Frontend** (Static Site)
- **Database MongoDB** (Managed Database)

### Servizi Configurati

1. **auralis-backend** - API Node.js/Express
2. **auralis-frontend** - App React/Vite
3. **auralis-mongodb** - Database MongoDB

## 📦 Deploy Step-by-Step

### Opzione A: Deploy Automatico (Raccomandato)

1. **Push del codice su GitHub**
   ```bash
   git add .
   git commit -m "Preparazione per deploy Render"
   git push origin main
   ```

2. **Connetti Repository su Render**
   - Vai su [render.com](https://render.com)
   - Fai login e vai su "Dashboard"
   - Clicca "New" → "Blueprint"
   - Connetti il tuo repository GitHub
   - Render rileverà automaticamente `render.yaml`

3. **Configura Variabili d'Ambiente**
   - Durante il setup, inserisci le variabili richieste
   - Render genererà automaticamente `JWT_SECRET`
   - Il `MONGODB_URI` sarà configurato automaticamente

### Opzione B: Deploy Manuale

#### 1. Database MongoDB
- Crea nuovo "Database" → MongoDB
- Nome: `auralis-mongodb`
- Piano: Starter (gratuito)
- Copia l'URL di connessione

#### 2. Backend API
- Crea nuovo "Web Service"
- Connetti repository GitHub
- Configurazione:
  - **Build Command**: `cd backend && npm ci`
  - **Start Command**: `cd backend && npm start`
  - **Environment**: Node
  - **Plan**: Starter

#### 3. Frontend Static Site
- Crea nuovo "Static Site"
- Configurazione:
  - **Build Command**: `cd frontend && npm ci && npm run build`
  - **Publish Directory**: `frontend/dist`

## 🔐 Configurazione Variabili d'Ambiente

### Backend Service
```
NODE_ENV=production
PORT=5000
MONGODB_URI=[auto-generated from database]
JWT_SECRET=[auto-generated]
CLERK_SECRET_KEY=[your-clerk-secret]
CLOUDINARY_CLOUD_NAME=[your-cloudinary-name]
CLOUDINARY_API_KEY=[your-cloudinary-key]
CLOUDINARY_API_SECRET=[your-cloudinary-secret]
CLIENT_URL=https://auralis-frontend.onrender.com
```

### Frontend Service
```
VITE_API_URL=https://auralis-backend.onrender.com
VITE_CLERK_PUBLISHABLE_KEY=[your-clerk-public-key]
```

## 🌐 URL Finali

Dopo il deploy, i tuoi servizi saranno disponibili su:
- **Frontend**: `https://auralis-frontend.onrender.com`
- **Backend API**: `https://auralis-backend.onrender.com`
- **Health Check**: `https://auralis-backend.onrender.com/api/health`

## 🔄 Deploy Automatico

Il deploy è configurato per:
- **Auto-deploy** su push al branch `main`
- **Preview deploys** per Pull Request (disabilitato di default)
- **Health checks** automatici
- **Sleep mode** su piano gratuito (risveglio automatico su richiesta)

## 📊 Monitoraggio

### Health Checks
- Backend: `/api/health`
- Frontend: automatico via Nginx

### Logs
Accedi ai logs tramite Render Dashboard:
1. Vai al tuo service
2. Clicca tab "Logs"
3. Monitor in tempo reale

## 🐛 Troubleshooting

### Errori Comuni

#### Build Failed - Frontend
```bash
# Verifica dipendenze localmente
cd frontend
npm ci
npm run build
```

#### Build Failed - Backend
```bash
# Verifica dipendenze localmente
cd backend
npm ci
npm start
```

#### Database Connection Issues
- Verifica che `MONGODB_URI` sia correttamente configurato
- Controlla whitelist IP su MongoDB Atlas (se usato)

#### Environment Variables
- Assicurati che tutte le variabili richieste siano configurate
- Verifica che i valori non contengano spazi o caratteri non validi

### Performance

#### Piano Gratuito Limitazioni
- Sleep dopo 15 minuti di inattività
- 750 ore di uptime al mese
- Banda limitata

#### Ottimizzazioni
- Utilizza CDN per assets statici
- Implementa caching Redis se necessario
- Ottimizza query database

## 🔧 Script di Utilità

### Build locale completo
```bash
npm run build
```

### Test locale in modalità produzione
```bash
# Backend
cd backend && NODE_ENV=production npm start

# Frontend (in another terminal)
cd frontend && npm run preview
```

### Seed database in produzione
```bash
# Tramite Render Shell
npm run seed
```

## 📚 Risorse Utili

- [Render Documentation](https://render.com/docs)
- [Render YAML Reference](https://render.com/docs/yaml-spec)
- [MongoDB Atlas](https://www.mongodb.com/atlas)
- [Clerk Documentation](https://clerk.com/docs)
- [Cloudinary Documentation](https://cloudinary.com/documentation)

## 🚨 Sicurezza

### Best Practices
- Non committare mai file `.env` con valori reali
- Usa sempre HTTPS in produzione
- Configura CORS correttamente
- Utilizza JWT secrets sicuri
- Abilita rate limiting

### Monitoring
- Configura alerting su Render
- Monitor usage e performance
- Backup regolari del database

---

Per supporto, consulta la documentazione ufficiale di Render o apri una issue su GitHub.
