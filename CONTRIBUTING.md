# 🤝 Contributing to Mushroom Hunter

Merci de votre intérêt pour contribuer à Mushroom Hunter ! Ce guide vous aidera à démarrer.

## 📋 Table des matières

- [Code de conduite](#code-de-conduite)
- [Comment contribuer](#comment-contribuer)
- [Développement local](#développement-local)
- [Guidelines de code](#guidelines-de-code)
- [Process de Pull Request](#process-de-pull-request)
- [Signalement de bugs](#signalement-de-bugs)
- [Suggestion de features](#suggestion-de-features)

## 📜 Code de conduite

En participant à ce projet, vous acceptez de respecter notre code de conduite :

- 🤝 Être respectueux et inclusif
- 🌍 Accueillir les contributeurs de tous horizons
- 💬 Accepter les critiques constructives
- 🎯 Se concentrer sur ce qui est meilleur pour la communauté
- ❤️ Faire preuve d'empathie envers les autres

## 🚀 Comment contribuer

### 1. Fork le repository
```bash
# Fork via GitHub UI, puis :
git clone https://github.com/YOUR_USERNAME/mushroom-hunter-app.git
cd mushroom-hunter-app
git remote add upstream https://github.com/nabz0r/mushroom-hunter-app.git
```

### 2. Créer une branche
```bash
git checkout -b feature/amazing-feature
# ou
git checkout -b fix/bug-description
```

### 3. Faire vos changements
```bash
# Coder...
git add .
git commit -m "feat: add amazing feature"
```

### 4. Push et créer une PR
```bash
git push origin feature/amazing-feature
```

## 💻 Développement local

### Prérequis
- Node.js 18+
- npm ou yarn
- Expo CLI
- iOS Simulator (Mac) ou Android Emulator

### Installation
```bash
npm install
# ou
yarn install
```

### Lancer l'app
```bash
# iOS
npm run ios

# Android
npm run android

# Web
npm run web
```

### Tests
```bash
# Unit tests
npm test

# Tests avec coverage
npm run test:coverage

# E2E tests
npm run test:e2e
```

## 📝 Guidelines de code

### Style de code
- Utilisez Prettier (config incluse)
- Suivez ESLint rules
- Utilisez TypeScript quand possible

### Conventions de nommage
- **Composants**: PascalCase (`MushroomCard.tsx`)
- **Utilities**: camelCase (`formatDate.ts`)
- **Constants**: SCREAMING_SNAKE_CASE (`API_ENDPOINTS.ts`)
- **Types/Interfaces**: PascalCase avec préfixe I (`IMushroomData`)

### Structure des commits
Suivez [Conventional Commits](https://www.conventionalcommits.org/):

```
feat: add mushroom identification AI
fix: correct GPS tracking on Android
docs: update README with new features
style: format code with prettier
refactor: optimize image processing
test: add unit tests for auth
chore: update dependencies
```

### Structure des fichiers
```
src/
├── components/     # Composants réutilisables
├── screens/        # Écrans de l'app
├── navigation/     # Configuration navigation
├── services/       # API, AI, etc.
├── store/          # Redux store
├── utils/          # Fonctions utilitaires
├── hooks/          # Custom React hooks
├── types/          # TypeScript types
└── assets/         # Images, fonts, etc.
```

## 🔄 Process de Pull Request

1. **Vérifiez** que votre code suit les guidelines
2. **Testez** votre code (unit + manual)
3. **Documentez** les changements si nécessaire
4. **Créez** une PR avec description détaillée
5. **Attendez** la review (généralement 48h)
6. **Addressez** les commentaires de review
7. **Merge** une fois approuvé !

### Template de PR
```markdown
## Description
Brève description des changements

## Type de changement
- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation

## Testing
- [ ] Tests unitaires passent
- [ ] Testé sur iOS
- [ ] Testé sur Android

## Screenshots
(Si applicable)

## Checklist
- [ ] Mon code suit les guidelines
- [ ] J'ai fait une self-review
- [ ] J'ai commenté le code complexe
- [ ] J'ai mis à jour la documentation
```

## 🐛 Signalement de bugs

Utilisez le template GitHub Issues avec :
- Description claire du problème
- Étapes pour reproduire
- Comportement attendu vs actuel
- Screenshots/logs si applicable
- Environment (OS, device, version app)

## 💡 Suggestion de features

Ouvrez une issue avec :
- Cas d'usage détaillé
- Bénéfices pour les utilisateurs
- Mockups/wireframes si possible
- Alternatives considérées

## 🏆 Hall of Fame

Merci à tous nos contributeurs ! 🍄❤️

## 📬 Contact

- Discord: [Join our server](https://discord.gg/mushroomhunter)
- Email: mushroom.hunter.app@gmail.com

---

*Happy mushroom hunting!* 🍄🎮