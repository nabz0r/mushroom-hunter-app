# 🍄 Mushroom Hunter - Real-World Foraging Meets Gaming

![Mushroom Hunter Banner](https://img.shields.io/badge/Mushroom%20Hunter-Real%20Foraging%20Game-green?style=for-the-badge)
![Version](https://img.shields.io/badge/version-1.0.0-blue?style=for-the-badge)
![Platform](https://img.shields.io/badge/platform-iOS%20%7C%20Android-lightgrey?style=for-the-badge)
![Tech](https://img.shields.io/badge/tech-React%20Native%20%7C%20AR%20%7C%20AI-purple?style=for-the-badge)

## 🎯 Quick Links

- [🚀 Getting Started](#-getting-started)
- [📱 Features](#-features)
- [🛠️ Tech Stack](#️-tech-stack)
- [📁 Project Structure](#-project-structure)
- [🔧 Configuration](#-configuration)
- [📊 API Documentation](./docs/API_DOCUMENTATION.md)
- [🚀 Deployment Guide](./docs/DEPLOYMENT.md)
- [🐛 Troubleshooting](./docs/TROUBLESHOOTING.md)

## 🎯 Concept

**Mushroom Hunter** transforme la cueillette traditionnelle de champignons en une expérience gaming moderne. Les joueurs explorent la vraie nature pour trouver de vrais champignons, utilisent l'IA pour les identifier, et gagnent des points basés sur la rareté réelle des espèces trouvées. C'est Pokémon GO meets mycologie !

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn
- Expo CLI
- iOS Simulator (Mac) or Android Emulator

### Installation

```bash
# Clone the repository
git clone https://github.com/nabz0r/mushroom-hunter-app.git
cd mushroom-hunter-app

# Install dependencies
npm install

# iOS specific
cd ios && pod install && cd ..

# Create environment file
cp .env.example .env.local
# Edit .env.local with your API keys

# Start the development server
npm start
```

### Running the App

```bash
# iOS
npm run ios

# Android
npm run android

# Web (limited functionality)
npm run web
```

## 📱 Features

### Core Features
- 🤖 **AI Identification** - Instant mushroom species recognition
- 🗺️ **Real-time Map** - Discover community-shared mushroom spots
- 🎮 **Gamification** - Points, levels, achievements based on real finds
- 👥 **Community** - Share spots, tips, and warnings
- 🥽 **AR Mode** - Augmented reality for immersive hunting
- ⚠️ **Safety First** - Clear toxicity warnings and expert verification
- 🌐 **Multi-language** - EN, FR, ES, DE, IT support
- 📱 **Offline Mode** - Works in forests without signal

## 🛠️ Tech Stack

### Frontend
- **React Native** + **Expo** - Cross-platform mobile development
- **TypeScript** - Type safety
- **Redux Toolkit** - State management
- **React Navigation** - Navigation
- **NativeWind** - Tailwind CSS for React Native
- **React Native Maps** - Mapping functionality
- **i18next** - Internationalization

### Backend Services
- **Node.js** + **Express** - API server
- **PostgreSQL** + **PostGIS** - Spatial database
- **Redis** - Caching layer
- **AWS S3** - Image storage
- **TensorFlow** - AI model serving

### DevOps
- **GitHub Actions** - CI/CD
- **Docker** - Containerization
- **Terraform** - Infrastructure as Code
- **AWS** - Cloud hosting
- **Sentry** - Error tracking

## 📁 Project Structure

```
mushroom-hunter-app/
├── src/
│   ├── components/     # Reusable UI components
│   ├── screens/        # App screens
│   ├── navigation/     # Navigation setup
│   ├── services/       # API and external services
│   ├── store/          # Redux store and slices
│   ├── hooks/          # Custom React hooks
│   ├── utils/          # Utility functions
│   ├── i18n/           # Translations
│   └── types/          # TypeScript types
├── assets/             # Images, fonts, etc.
├── scripts/            # Build and deployment scripts
├── docs/               # Documentation
└── __tests__/          # Test files
```

## 🔧 Configuration

### Environment Variables

```env
# API Configuration
EXPO_PUBLIC_API_URL=https://api.mushroomhunter.app
EXPO_PUBLIC_API_VERSION=v1

# AI Service
EXPO_PUBLIC_AI_API_KEY=your_ai_api_key

# Maps
EXPO_PUBLIC_GOOGLE_MAPS_API_KEY=your_google_maps_key

# Analytics
EXPO_PUBLIC_MIXPANEL_TOKEN=your_mixpanel_token
EXPO_PUBLIC_SENTRY_DSN=your_sentry_dsn
```

## 📊 Development

### Testing

```bash
# Run unit tests
npm test

# Run with coverage
npm run test:coverage

# E2E tests
npm run test:e2e
```

### Linting & Formatting

```bash
# Lint code
npm run lint

# Format code
npm run format

# Type check
npm run type-check
```

### Building

```bash
# Build for production
eas build --platform all

# Build locally
npm run build:ios
npm run build:android
```

## 🚀 Deployment

See [DEPLOYMENT.md](./docs/DEPLOYMENT.md) for detailed deployment instructions.

### Quick Deploy

```bash
# Deploy to staging
npm run deploy:staging

# Deploy to production
npm run deploy:production

# Submit to app stores
eas submit --platform all
```

## 📚 Documentation

- [API Documentation](./docs/API_DOCUMENTATION.md)
- [Database Schema](./docs/DATABASE_SCHEMA.md)
- [Architecture Overview](./docs/ARCHITECTURE.md)
- [Contributing Guide](./CONTRIBUTING.md)
- [Security Policy](./SECURITY.md)

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guide](./CONTRIBUTING.md) for details.

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](./LICENSE) file for details.

## 🙏 Acknowledgments

- Mushroom identification AI model trained on 500K+ images
- Community of beta testers and mushroom enthusiasts
- Open source libraries and contributors

## 📞 Support

- **Email**: support@mushroomhunter.app
- **Discord**: [Join our community](https://discord.gg/mushroomhunter)
- **Issues**: [GitHub Issues](https://github.com/nabz0r/mushroom-hunter-app/issues)

---

*Happy Hunting! 🍄🎮*