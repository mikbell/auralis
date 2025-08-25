# 🎵 Spotify Clone - Applicazione di Streaming Musicale Full Stack

Una moderna applicazione di streaming musicale full-stack costruita con lo stack MERN (MongoDB, Express.js, React, Node.js) che presenta funzionalità in tempo reale, controlli audio avanzati e una bellissima interfaccia utente completamente tradotta in italiano.

## ✨ Caratteristiche

### 🎵 Streaming Musicale
- **Player Audio Avanzato** con controllo volume, riproduzione casuale, modalità ripetizione
- **Gestione Coda** con vista espandibile del player
- **Conteggio Riproduzioni** in tempo reale
- **Ricerca Brani** con debouncing e filtri
- **Sezioni In Evidenza, Tendenze e Creato per Te**

### 🇮🇹 Interfaccia Italiana
- **Completamente tradotta** in italiano
- **Saluti dinamici** basati sull'orario (Buongiorno, Buon pomeriggio, Buonasera)
- **Notifiche toast** personalizzate in italiano
- **Messaggi di errore** user-friendly in italiano
- **Animazioni fluide** e micro-interazioni

### 🔐 Authentication & Authorization
- **Clerk Authentication** integration
- **Role-based Access** (User/Admin)
- **Protected Routes** and API endpoints

### 👥 Social Features
- **Real-time Chat** with Socket.IO
- **Friends Activity** tracking
- **Like/Unlike** songs functionality
- **User Presence** indicators

### 🎛️ Admin Panel
- **Song Management** (Upload, Edit, Delete)
- **Album Management** with cover art
- **User Statistics** and analytics
- **Content Moderation** tools

### 🏗️ Technical Features
- **Error Boundaries** for graceful error handling
- **Loading States** and skeleton components
- **Responsive Design** for all screen sizes
- **Performance Optimized** with React.memo and useMemo
- **Type Safety** with TypeScript
- **Database Indexing** for fast queries
- **Rate Limiting** and security headers

## 🛠️ Tech Stack

### Frontend
- **React 19** with TypeScript
- **Tailwind CSS** for styling
- **shadcn/ui** component library
- **Zustand** for state management
- **React Router** for navigation
- **Axios** for API calls
- **Socket.IO Client** for real-time features

### Backend
- **Node.js** with Express
- **MongoDB** with Mongoose ODM
- **Socket.IO** for real-time communication
- **Clerk** for authentication
- **Cloudinary** for media storage
- **Express Rate Limit** for API protection
- **Helmet** for security headers
- **Compression** for response optimization

### DevOps
- **Docker** containerization
- **Docker Compose** for multi-service setup
- **Nginx** reverse proxy
- **Health Checks** for monitoring

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ and npm
- MongoDB (local or cloud)
- Clerk account
- Cloudinary account (for media storage)

### 1. Clone the Repository
```bash
git clone <repository-url>
cd spotify-clone
```

### 2. Environment Setup

#### Backend (.env in /backend)
```env
NODE_ENV=development
PORT=5000
MONGODB_URI=mongodb://localhost:27017/spotify_clone
CLERK_SECRET_KEY=your_clerk_secret_key
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
CLIENT_URL=http://localhost:5173
```

#### Frontend (.env in /frontend)
```env
VITE_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
VITE_API_URL=http://localhost:5000
```

### 3. Install Dependencies

#### Backend
```bash
cd backend
npm install
```

#### Frontend
```bash
cd frontend
npm install
```

### 4. Run the Application

#### Development Mode
```bash
# Backend (terminal 1)
cd backend
npm run dev

# Frontend (terminal 2)
cd frontend
npm run dev
```

The application will be available at:
- Frontend: http://localhost:5173
- Backend API: http://localhost:5000

### 5. Seed Database (Optional)
```bash
cd backend
npm run seed:songs
npm run seed:albums
```

## 🚀 Deploy su Render

Il progetto è configurato per il deploy automatico su Render tramite Blueprint.

### Quick Deploy
1. **Configura le variabili d'ambiente** (vedi `.env.example`)
2. **Push su GitHub**: `git push origin main`
3. **Crea Blueprint su Render** - rileverà automaticamente `render.yaml`
4. **Inserisci le variabili d'ambiente** su Render

### Verifica Pre-Deploy
```bash
npm run check-deploy
```

📖 **Guida completa**: Leggi `DEPLOY.md` per istruzioni dettagliate

## 🐳 Docker Deployment (Locale)

### Using Docker Compose (Recommended)
```bash
# Create environment file
cp .env.example .env

# Build and start all services
docker-compose up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down
```

### Individual Container Build
```bash
# Backend
cd backend
docker build -t spotify-backend .

# Frontend
cd frontend
docker build -t spotify-frontend .
```

## 📁 Project Structure

```
spotify-clone/
├── backend/
│   ├── src/
│   │   ├── controllers/         # Request handlers
│   │   ├── models/              # Database schemas
│   │   ├── routes/              # API routes
│   │   ├── middlewares/         # Custom middleware
│   │   ├── utils/               # Utility functions
│   │   ├── config/              # Configuration files
│   │   └── index.js             # Server entry point
│   ├── Dockerfile
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/          # Reusable components
│   │   ├── pages/               # Page components
│   │   ├── stores/              # Zustand stores
│   │   ├── hooks/               # Custom hooks
│   │   ├── lib/                 # Utility libraries
│   │   ├── types/               # TypeScript types
│   │   └── App.tsx              # Main app component
│   ├── Dockerfile
│   ├── nginx.conf
│   └── package.json
├── docker-compose.yml
└── README.md
```

## 🔧 API Endpoints

### Authentication
- `POST /api/auth/callback` - Handle Clerk authentication

### Songs
- `GET /api/songs` - Get all songs (paginated)
- `GET /api/songs/featured` - Get featured songs
- `GET /api/songs/trending` - Get trending songs
- `GET /api/songs/made-for-you` - Get personalized recommendations
- `GET /api/songs/:id` - Get single song
- `POST /api/songs/:id/play` - Increment play count

### Albums
- `GET /api/albums` - Get all albums
- `GET /api/albums/:id` - Get single album

### Admin (Protected)
- `POST /api/admin/songs` - Create song
- `PUT /api/admin/songs/:id` - Update song
- `DELETE /api/admin/songs/:id` - Delete song
- `POST /api/admin/albums` - Create album
- `DELETE /api/admin/albums/:id` - Delete album

### Statistics
- `GET /api/stats` - Get app statistics

## 🎯 Performance Optimizations

### Frontend
- **Component Memoization** with React.memo
- **Computed Values** with useMemo
- **Callback Optimization** with useCallback
- **Lazy Loading** for images
- **Code Splitting** with dynamic imports
- **Bundle Optimization** with Vite

### Backend
- **Database Indexing** for fast queries
- **Response Compression** with gzip
- **Rate Limiting** to prevent abuse
- **Connection Pooling** for MongoDB
- **Caching Headers** for static assets

## 🔒 Security Features

- **CORS** configuration
- **Security Headers** with Helmet
- **Input Validation** with express-validator
- **Rate Limiting** on API endpoints
- **Authentication Middleware** protection
- **SQL Injection** prevention with Mongoose
- **XSS Protection** with content security policy

## 🐛 Error Handling

- **Error Boundaries** in React components
- **Global Error Handler** in Express
- **Graceful Degradation** for failed requests
- **User-Friendly Error Messages**
- **Logging** for debugging

## 📱 Responsive Design

- **Mobile-First** approach
- **Flexible Grid** layouts
- **Touch-Friendly** controls
- **Adaptive Components** for different screen sizes

## 🧪 Testing

```bash
# Backend tests
cd backend
npm test

# Frontend tests
cd frontend
npm test

# E2E tests
npm run test:e2e
```

## 📊 Monitoring

### Health Checks
- Backend: `GET /api/health`
- Database connectivity check
- External service availability

### Metrics
- Request/response times
- Error rates
- User activity
- System resources

## 🚀 Deployment

### Production Environment
1. Set `NODE_ENV=production`
2. Configure production database
3. Set up SSL certificates
4. Configure CDN for static assets
5. Set up monitoring and logging

### Environment Variables
```env
# Production
NODE_ENV=production
MONGODB_URI=mongodb+srv://...
REDIS_URL=redis://...
CLOUDINARY_URL=cloudinary://...

# Security
JWT_SECRET=your-super-secure-secret
CLERK_SECRET_KEY=your-clerk-secret
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📝 License

This project is licensed under the MIT License.

## 🙏 Acknowledgments

- [Clerk](https://clerk.dev/) for authentication
- [Cloudinary](https://cloudinary.com/) for media storage
- [shadcn/ui](https://ui.shadcn.com/) for beautiful components
- [Tailwind CSS](https://tailwindcss.com/) for styling

## 📧 Support

If you have any questions or need help, please open an issue or contact [your-email@example.com](mailto:your-email@example.com).
