# 🌾 Ikimera - Smart Farming Assistant

A Progressive Web App (PWA) designed for farmers to diagnose crop diseases using AI technology, with offline capabilities and weather integration.

## 🚀 Features

### Phase 1 MVP
- **Authentication**: JWT-based signup/login system
- **Crop Disease Diagnosis**: Upload crop images and get AI-powered analysis
- **History Tracking**: View all past diagnoses and results
- **Weather Integration**: Real-time weather forecasts for farming decisions
- **PWA Support**: Offline functionality and installable on mobile devices

## 🛠️ Tech Stack

**Frontend:**
- React 18 + Vite (TypeScript)
- Static HTML/CSS/JS version (for quick demo)
- Service Worker for offline support
- Responsive design (mobile-first)

**Backend:**
- Node.js with Express.js
- MongoDB with Mongoose ODM
- JWT authentication
- Multer for file uploads
- OpenWeatherMap API integration

## 📦 Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd ikimera-app
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   ```
   Edit `.env` with your configuration:
   - `MONGODB_URI`: Your MongoDB connection string
   - `JWT_SECRET`: Secret key for JWT tokens
   - `OPENWEATHER_API_KEY`: API key from OpenWeatherMap (optional - will use dummy data if not provided)

4. **Start MongoDB**
   Make sure MongoDB is running on your system or use a cloud service like MongoDB Atlas.

## 🚀 Running the Application

### Development Mode

1. **Start the backend server:**
   ```bash
   npm run server
   ```
   API at `http://localhost:3001`

2. **Start the React app (Vite):**
   ```bash
   npm run dev
   ```
   React app at `http://localhost:5173`

3. **Start the static demo (HTML/CSS/JS):**
   ```bash
   npm run serve:static
   ```
   Static app at `http://localhost:8081`

### Production Build

```bash
# For production, serve the files using any static file server
# or deploy to any web hosting service
```

## 📱 PWA Features

- **Offline Support**: Works without internet connection
- **Installable**: Can be installed on mobile home screen
- **Background Sync**: Queues uploads when offline and syncs when online
- **Push Notifications**: Alerts for completed diagnoses
- **Responsive Design**: Optimized for all device sizes

## 🗂️ Project Structure

```
ikimera-app/
├── backend/
│   ├── config/
│   │   └── db.js              # Database configuration
│   ├── middleware/
│   │   └── auth.js             # JWT authentication middleware
│   ├── models/
│   │   ├── User.js             # User model
│   │   └── Upload.js           # Upload model
│   ├── routes/
│   │   ├── auth.js             # Authentication routes
│   │   ├── upload.js           # Image upload routes
│   │   ├── history.js          # History routes
│   │   └── weather.js          # Weather routes
│   └── server.js               # Express server
├── src/                      # React (Vite) app source
│   ├── components/
│   │   ├── AuthScreen.tsx      # Login/signup interface
│   │   ├── DiagnoseTab.tsx     # Crop diagnosis interface
│   │   ├── HistoryTab.tsx      # History viewing interface
│   │   ├── WeatherTab.tsx      # Weather forecast interface
│   │   └── ProfileTab.tsx      # User profile interface
│   ├── context/
│   │   └── AuthContext.tsx     # Authentication context
│   ├── App.tsx                 # Main application component
│   └── App.css                 # Custom styles
├── public/                   # Assets served by Vite
│   ├── manifest.json           # PWA manifest
│   └── service-worker.js       # Service worker for offline support
├── static/                   # Standalone static site (HTML/CSS/JS)
│   ├── index.html
│   ├── styles.css
│   ├── app.js
│   ├── manifest.json
│   └── service-worker.js
└── README.md
```

## 🔧 API Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/auth/signup` | POST | Register new user |
| `/api/auth/login` | POST | Login user |
| `/api/upload` | POST | Upload crop image for diagnosis |
| `/api/history` | GET | Get user's diagnosis history |
| `/api/weather` | GET | Get weather forecast |

## 🎨 Design Features

- **Mobile-First**: Optimized for smartphone usage
- **Farmer-Friendly**: Large buttons, clear icons, intuitive navigation
- **Color-Coded Results**: 
  - 🟢 Green = Healthy
  - 🟡 Yellow = Warning
  - 🔴 Red = Infected
- **Professional UI**: Clean, modern design with smooth animations

## 🔮 Future Enhancements

- Real AI model integration (replacing dummy responses)
- Multiple language support
- Crop growth tracking
- Community features (farmer forums)
- Integration with agricultural extension services
- Advanced analytics and insights

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- OpenWeatherMap for weather data
- Lucide React for beautiful icons
- MongoDB and Express.js communities
- All farmers who inspired this project

---

**Built with ❤️ for farmers worldwide** 🌾