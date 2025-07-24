# 🍄 Mushroom Hunter API Documentation

## Base URL
```
https://api.mushroomhunter.app/v1
```

## Authentication

All authenticated endpoints require a Bearer token in the Authorization header:
```
Authorization: Bearer <token>
```

## Endpoints

### Authentication

#### POST /auth/register
Create a new user account.

**Request Body:**
```json
{
  "username": "string",
  "email": "string",
  "password": "string"
}
```

**Response:**
```json
{
  "user": {
    "id": "string",
    "username": "string",
    "email": "string",
    "level": 1,
    "points": 0
  },
  "token": "string"
}
```

#### POST /auth/login
Authenticate a user.

**Request Body:**
```json
{
  "email": "string",
  "password": "string"
}
```

### Mushroom Identification

#### POST /mushrooms/identify
Identify a mushroom from an image using AI.

**Request Body:**
```json
{
  "image": "base64_string",
  "location": {
    "latitude": 48.8566,
    "longitude": 2.3522
  }
}
```

**Response:**
```json
{
  "id": "string",
  "mushroom": {
    "name": "Boletus edulis",
    "scientificName": "Boletus edulis",
    "confidence": 0.92
  },
  "alternativeSuggestions": [
    {
      "name": "Boletus pinophilus",
      "scientificName": "Boletus pinophilus",
      "confidence": 0.05
    }
  ],
  "edibility": {
    "isEdible": true,
    "warnings": [],
    "preparationNotes": "Excellent comestible, peut être consommé cru ou cuit"
  },
  "rarity": "uncommon",
  "points": 45,
  "timestamp": "2024-10-15T14:30:00Z"
}
```

### Spots

#### GET /spots/nearby
Get mushroom spots near a location.

**Query Parameters:**
- `latitude` (required): Latitude coordinate
- `longitude` (required): Longitude coordinate
- `radius` (optional): Search radius in meters (default: 5000, max: 50000)
- `limit` (optional): Maximum results (default: 50, max: 100)

**Response:**
```json
{
  "spots": [
    {
      "id": "string",
      "mushroomId": "string",
      "mushroomName": "Chanterelle",
      "userId": "string",
      "username": "Chasseur123",
      "latitude": 48.8566,
      "longitude": 2.3522,
      "distance": 250,
      "photos": ["url1", "url2"],
      "notes": "Trouvé près d'un vieux chêne",
      "dateFound": "2024-10-15T10:00:00Z",
      "verified": true,
      "publicSpot": true
    }
  ],
  "total": 15
}
```

#### POST /spots
Create a new mushroom spot.

**Request Body:**
```json
{
  "mushroomId": "string",
  "latitude": 48.8566,
  "longitude": 2.3522,
  "photos": ["base64_string"],
  "notes": "string",
  "publicSpot": true
}
```

### Game & Leaderboard

#### GET /game/leaderboard
Get the global leaderboard.

**Query Parameters:**
- `period`: `daily` | `weekly` | `monthly` | `all-time` (default: `weekly`)
- `limit`: Number of results (default: 100, max: 500)
- `offset`: Pagination offset (default: 0)

**Response:**
```json
{
  "leaderboard": [
    {
      "rank": 1,
      "userId": "string",
      "username": "MycoMaster",
      "avatar": "url",
      "points": 15420,
      "level": 42,
      "mushroomsFound": 523,
      "rareFinds": 12
    }
  ],
  "userPosition": {
    "rank": 156,
    "points": 3250
  }
}
```

#### GET /game/quests
Get available quests.

**Response:**
```json
{
  "daily": [
    {
      "id": "daily_001",
      "title": "Première découverte",
      "description": "Trouvez votre premier champignon aujourd'hui",
      "requirements": [
        {
          "type": "find_mushroom",
          "target": 1,
          "current": 0
        }
      ],
      "reward": {
        "points": 50,
        "achievement": null
      },
      "expiresAt": "2024-10-15T23:59:59Z"
    }
  ],
  "weekly": [],
  "seasonal": []
}
```

### AI Service

#### POST /ai/identify
Direct AI identification endpoint.

**Request Body:**
```json
{
  "image": "base64_string",
  "model": "mushroom-classifier-v2",
  "includeMetadata": true
}
```

**Response:**
```json
{
  "predictions": [
    {
      "species": "Boletus edulis",
      "scientificName": "Boletus edulis",
      "confidence": 0.92,
      "edible": true,
      "warnings": []
    }
  ],
  "metadata": {
    "processingTime": 1250,
    "modelVersion": "2.3.1"
  }
}
```

## Error Responses

All errors follow this format:
```json
{
  "error": {
    "code": "ERROR_CODE",
    "message": "Human readable error message",
    "details": {}
  }
}
```

### Common Error Codes:
- `UNAUTHORIZED`: Missing or invalid authentication
- `FORBIDDEN`: Insufficient permissions
- `NOT_FOUND`: Resource not found
- `VALIDATION_ERROR`: Invalid request data
- `RATE_LIMITED`: Too many requests
- `SERVER_ERROR`: Internal server error

## Rate Limiting

- **Anonymous**: 60 requests/hour
- **Authenticated**: 600 requests/hour
- **AI Identification**: 100 requests/day

Rate limit info is included in response headers:
```
X-RateLimit-Limit: 600
X-RateLimit-Remaining: 599
X-RateLimit-Reset: 1697381400
```

## Webhooks

Webhooks can be configured for the following events:
- `mushroom.identified`: New mushroom identified
- `spot.created`: New spot created
- `spot.verified`: Spot verified by community
- `achievement.unlocked`: User unlocked achievement
- `level.up`: User leveled up

## SDKs

Official SDKs available:
- JavaScript/TypeScript: `npm install @mushroomhunter/sdk`
- Python: `pip install mushroomhunter`
- Swift: Via Swift Package Manager
- Kotlin: Via Maven Central
