export const API_ENDPOINTS = {
  BASE_URL: process.env.EXPO_PUBLIC_API_URL || 'https://api.mushroomhunter.app',
  AUTH: {
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
    LOGOUT: '/auth/logout',
    REFRESH: '/auth/refresh',
  },
  MUSHROOMS: {
    LIST: '/mushrooms',
    IDENTIFY: '/mushrooms/identify',
    DETAILS: (id: string) => `/mushrooms/${id}`,
  },
  SPOTS: {
    LIST: '/spots',
    CREATE: '/spots',
    NEARBY: '/spots/nearby',
    DETAILS: (id: string) => `/spots/${id}`,
  },
  USER: {
    PROFILE: '/user/profile',
    STATS: '/user/stats',
    ACHIEVEMENTS: '/user/achievements',
    UPDATE: '/user/update',
  },
  GAME: {
    LEADERBOARD: '/game/leaderboard',
    QUESTS: '/game/quests',
    EVENTS: '/game/events',
  },
};

export const RARITY_CONFIG = {
  common: {
    color: '#6B7280',
    points: { min: 10, max: 25 },
    dropRate: 0.60,
  },
  uncommon: {
    color: '#10B981',
    points: { min: 30, max: 60 },
    dropRate: 0.25,
  },
  rare: {
    color: '#3B82F6',
    points: { min: 70, max: 120 },
    dropRate: 0.10,
  },
  very_rare: {
    color: '#8B5CF6',
    points: { min: 150, max: 300 },
    dropRate: 0.04,
  },
  legendary: {
    color: '#F59E0B',
    points: { min: 400, max: 1000 },
    dropRate: 0.01,
  },
};

export const SEASON_MONTHS = {
  spring: [3, 4, 5],
  summer: [6, 7, 8],
  autumn: [9, 10, 11],
  winter: [12, 1, 2],
};

export const WEATHER_MULTIPLIERS = {
  sunny: 1.0,
  cloudy: 1.2,
  rainy: 1.5,
  afterRain: 2.0,
  foggy: 1.3,
};

export const ACHIEVEMENTS = {
  FIRST_FIND: 'first_find',
  RARE_HUNTER: 'rare_hunter',
  SPECIES_MASTER: 'species_master',
  COMMUNITY_HELPER: 'community_helper',
  STREAK_WARRIOR: 'streak_warrior',
  NIGHT_OWL: 'night_owl',
  EARLY_BIRD: 'early_bird',
  SAFETY_FIRST: 'safety_first',
};