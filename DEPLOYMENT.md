# 🚀 Mushroom Hunter - Guide de Déploiement

## Prérequis

- Node.js 18+
- Expo CLI (`npm install -g expo-cli`)
- EAS CLI (`npm install -g eas-cli`)
- Compte Expo
- Compte Apple Developer (iOS)
- Compte Google Play Developer (Android)

## Configuration Initiale

### 1. Installation
```bash
# Cloner le repo
git clone https://github.com/nabz0r/mushroom-hunter-app.git
cd mushroom-hunter-app

# Installer les dépendances
npm install

# Configurer l'environnement
cp .env.example .env.local
# Modifier .env.local avec vos clés API
```

### 2. Configuration Expo/EAS
```bash
# Login Expo
expo login

# Login EAS
eas login

# Configurer le projet
eas build:configure
```

## Build de Développement

### iOS
```bash
# Build de développement
eas build --platform ios --profile development

# Installer sur simulateur
eas build:run -p ios
```

### Android
```bash
# Build de développement
eas build --platform android --profile development

# Installer sur émulateur
eas build:run -p android
```

## Build de Production

### 1. Préparation
```bash
# Bump version
npm version patch # ou minor/major

# Vérifier la configuration
eas build:inspect
```

### 2. Build iOS
```bash
# Build pour App Store
eas build --platform ios --profile production

# Soumettre à l'App Store
eas submit -p ios
```

### 3. Build Android
```bash
# Build pour Google Play
eas build --platform android --profile production

# Soumettre au Google Play
eas submit -p android
```

## Configuration des Services

### Backend API
Le backend doit être déployé avec :
- Node.js + Express
- PostgreSQL avec PostGIS
- Redis pour le cache
- S3 pour le stockage des images

### Services Tiers
1. **Google Maps** : Configurer les clés API dans la console Google Cloud
2. **AI Service** : Déployer le modèle TensorFlow sur un serveur GPU
3. **Analytics** : Configurer Mixpanel/Firebase Analytics
4. **Monitoring** : Configurer Sentry pour le tracking d'erreurs

## Monitoring

### Crashlytics
```bash
# Installer
npm install @react-native-firebase/crashlytics

# Configurer dans App.tsx
import crashlytics from '@react-native-firebase/crashlytics';
```

### Performance
```bash
# Installer
npm install @react-native-firebase/perf

# Monitorer les performances critiques
```

## CI/CD avec GitHub Actions

Les workflows sont déjà configurés dans `.github/workflows/`

### Secrets à configurer
- `EXPO_TOKEN`
- `APPLE_ID`
- `APPLE_APP_SPECIFIC_PASSWORD`
- `GOOGLE_SERVICE_ACCOUNT_KEY`
- `CODECOV_TOKEN`

## Checklist de Release

- [ ] Tests passés
- [ ] Version bumpée
- [ ] Changelog mis à jour
- [ ] Screenshots App Store/Play Store à jour
- [ ] Descriptions des stores mises à jour
- [ ] Backend compatible déployé
- [ ] Migrations DB exécutées
- [ ] Feature flags configurés
- [ ] Monitoring actif
- [ ] Tag Git créé

## Rollback

En cas de problème :

```bash
# Rollback backend
heroku rollback v123

# Rollback mobile (via les stores)
# Impossible de rollback, mais possibilité de :
# 1. Publier un hotfix rapide
# 2. Utiliser les feature flags pour désactiver
```

## Support

- Discord: [discord.gg/mushroomhunter](https://discord.gg/mushroomhunter)
- Email: support@mushroomhunter.app