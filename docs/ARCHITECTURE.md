# 🏗️ Architecture Technique - Mushroom Hunter

## Vue d'ensemble

Mushroom Hunter est une application mobile React Native utilisant une architecture modulaire et scalable.

```
┌─────────────────────────────────────────────────────────────────────┐
│                          Frontend (React Native)                      │
│  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐  │
│  │   Components    │  │     Screens     │  │   Navigation    │  │
│  └─────────────────┘  └─────────────────┘  └─────────────────┘  │
│  ┌─────────────────────────────────────────────────────┐  │
│  │                    State Management (Redux)                    │  │
│  └─────────────────────────────────────────────────────┘  │
│  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐  │
│  │    Services     │  │      Hooks      │  │     Utils       │  │
│  └─────────────────┘  └─────────────────┘  └─────────────────┘  │
└─────────────────────────────────────────────────────────────────────┘
                                     │
                                     ↓
┌─────────────────────────────────────────────────────────────────────┐
│                           Backend Services                            │
│  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐  │
│  │   REST API      │  │   AI Service    │  │  Image Storage  │  │
│  │  (Node.js)      │  │  (TensorFlow)   │  │    (AWS S3)     │  │
│  └─────────────────┘  └─────────────────┘  └─────────────────┘  │
│  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐  │
│  │   PostgreSQL    │  │     Redis       │  │  External APIs  │  │
│  │   + PostGIS     │  │    (Cache)      │  │  (Maps, Météo)  │  │
│  └─────────────────┘  └─────────────────┘  └─────────────────┘  │
└─────────────────────────────────────────────────────────────────────┘
```

## Stack Technique

### Frontend Mobile
- **Framework**: React Native + Expo
- **Navigation**: React Navigation v6
- **State Management**: Redux Toolkit + RTK Query
- **Styling**: NativeWind (Tailwind CSS)
- **Maps**: React Native Maps
- **AR/3D**: Three.js + Expo GL
- **Forms**: React Hook Form
- **Animations**: React Native Reanimated 3

### Backend
- **API**: Node.js + Express + GraphQL
- **Database**: PostgreSQL 14+ avec PostGIS
- **Cache**: Redis 7+
- **Queue**: Bull (Redis-based)
- **Auth**: JWT + Refresh Tokens
- **File Storage**: AWS S3
- **CDN**: CloudFront

### AI/ML
- **Framework**: TensorFlow 2.x
- **Model**: CNN personnalisé pour classification
- **Training**: Python + Keras
- **Serving**: TensorFlow Serving
- **Preprocessing**: OpenCV

### DevOps
- **CI/CD**: GitHub Actions
- **Hosting**: AWS (ECS + RDS + ElastiCache)
- **Monitoring**: Sentry + CloudWatch
- **Analytics**: Mixpanel
- **Logs**: Winston + CloudWatch Logs

## Patterns & Principes

### 1. Clean Architecture
```
src/
├── domain/          # Business logic pure
├── data/            # Data sources et repositories
├── presentation/    # UI et state management
└── infrastructure/  # Services externes
```

### 2. Composition over Inheritance
- Utilisation de hooks personnalisés
- Composants fonctionnels
- Higher-Order Components minimisés

### 3. SOLID Principles
- Single Responsibility: Un composant = une responsabilité
- Open/Closed: Extensions via props et composition
- Dependency Injection: Via Context API et props

## Flux de Données

### Identification de Champignon
```
1. User prend photo
   ↓
2. Image compressée et encodée en base64
   ↓
3. Envoi à l'API avec métadonnées GPS
   ↓
4. API forward vers service AI
   ↓
5. AI analyse et retourne prédictions
   ↓
6. API enrichit avec données DB
   ↓
7. Résultat caché et retourné au client
   ↓
8. UI affiche résultats avec confidence
```

### Real-time Features
- WebSocket pour notifications
- Server-Sent Events pour leaderboard
- Polling optimisé pour spots nearby

## Sécurité

### Auth Flow
```
1. Login avec email/password
2. Server génère JWT (15min) + Refresh Token (30j)
3. JWT stocké en mémoire
4. Refresh Token dans Keychain/Keystore
5. Auto-refresh transparent
```

### Data Protection
- HTTPS partout
- Certificate pinning
- Chiffrement des données sensibles
- RGPD compliance
- Anonymisation des spots privés

## Performance

### Optimisations Mobile
- Lazy loading des écrans
- Image caching avec Expo Image
- Virtualisation des listes
- Debouncing des recherches
- Batch des requêtes API

### Optimisations Backend
- Query optimization avec EXPLAIN
- Indexation spatiale PostGIS
- Redis caching stratégique
- CDN pour assets statiques
- API response compression

## Scalabilité

### Horizontal Scaling
- API stateless
- Sessions dans Redis
- Load balancer (ALB)
- Auto-scaling groups

### Database Scaling
- Read replicas pour queries lourdes
- Partitioning par région géographique
- Connection pooling
- Query result caching

## Monitoring & Observability

### Métriques Clés
- API response time p50/p95/p99
- AI inference latency
- Mobile app crash rate
- User session duration
- Feature adoption rate

### Alerting
- Crash rate > 1%
- API latency > 500ms (p95)
- AI accuracy < 85%
- Error rate > 5%

## Disaster Recovery

- RTO: 4 heures
- RPO: 1 heure
- Backups automatisés (DB + S3)
- Multi-AZ deployment
- Runbooks documentés
