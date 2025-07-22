import { Mushroom, MushroomSpot } from '@/store/slices/mushroomSlice';
import { Quest, Achievement } from '@/store/slices/gameSlice';
import { GameEvent } from '@/types';

// Mock Mushrooms Database
export const mockMushrooms: Mushroom[] = [
  {
    id: '1',
    name: 'Cèpe de Bordeaux',
    scientificName: 'Boletus edulis',
    edible: true,
    rarity: 'uncommon',
    points: 45,
    description: 'Un des champignons les plus recherchés, excellent comestible.',
    habitat: ['Forêts de feuillus', 'Sous les chênes', 'Sols acides'],
    season: ['summer', 'autumn'],
    lookalikes: ['Bolet amer', 'Bolet de fiel'],
    imageUrl: 'https://images.unsplash.com/photo-1504545102780-26774c1bb073?w=400',
  },
  {
    id: '2',
    name: 'Chanterelle',
    scientificName: 'Cantharellus cibarius',
    edible: true,
    rarity: 'common',
    points: 25,
    description: 'Facilement reconnaissable à sa couleur jaune d\'œuf.',
    habitat: ['Forêts mixtes', 'Mousses', 'Myrtilles'],
    season: ['summer', 'autumn'],
    lookalikes: ['Fausse chanterelle'],
    imageUrl: 'https://images.unsplash.com/photo-1567306226416-28f0efdc88ce?w=400',
  },
  {
    id: '3',
    name: 'Morille',
    scientificName: 'Morchella esculenta',
    edible: true,
    rarity: 'rare',
    points: 95,
    description: 'Champignon printanier très prisé des gastronomes.',
    habitat: ['Bords de rivière', 'Vergers', 'Zones incendiées'],
    season: ['spring'],
    lookalikes: ['Gyromitre'],
    imageUrl: 'https://images.unsplash.com/photo-1583170108468-eb5e5e4647d2?w=400',
  },
  {
    id: '4',
    name: 'Amanite tue-mouches',
    scientificName: 'Amanita muscaria',
    edible: false,
    rarity: 'common',
    points: 15,
    description: 'Toxique! Facilement reconnaissable avec son chapeau rouge à points blancs.',
    habitat: ['Sous les bouleaux', 'Forêts de conifères'],
    season: ['autumn'],
    lookalikes: ['Amanite des Césars'],
    imageUrl: 'https://images.unsplash.com/photo-1574482620811-1aa16ffe3c82?w=400',
  },
  {
    id: '5',
    name: 'Truffe noire',
    scientificName: 'Tuber melanosporum',
    edible: true,
    rarity: 'very_rare',
    points: 250,
    description: 'Le diamant noir de la cuisine, pousse sous terre.',
    habitat: ['Chênaies', 'Sols calcaires', 'Régions méditerranéennes'],
    season: ['winter'],
    lookalikes: ['Truffe de Bourgogne'],
    imageUrl: 'https://images.unsplash.com/photo-1635774804901-23c61b5c8708?w=400',
  },
];

// Mock Spots
export const mockSpots: MushroomSpot[] = [
  {
    id: 'spot1',
    mushroomId: '1',
    userId: 'user123',
    latitude: 48.8584,
    longitude: 2.3522,
    photos: ['https://example.com/photo1.jpg'],
    notes: 'Trouvé sous un grand chêne près du sentier',
    dateFound: '2024-10-14T10:30:00Z',
    verified: true,
    publicSpot: true,
  },
  {
    id: 'spot2',
    mushroomId: '2',
    userId: 'user456',
    latitude: 48.8606,
    longitude: 2.3376,
    photos: ['https://example.com/photo2.jpg'],
    notes: 'Groupe de chanterelles dans la mousse',
    dateFound: '2024-10-13T15:45:00Z',
    verified: false,
    publicSpot: true,
  },
];

// Mock Quests
export const mockQuests: Quest[] = [
  {
    id: 'daily_001',
    title: 'Première découverte',
    description: 'Trouvez votre premier champignon de la journée',
    type: 'daily',
    requirements: [
      {
        type: 'find_mushroom',
        target: 1,
        current: 0,
        metadata: {},
      },
    ],
    reward: {
      points: 50,
    },
    expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'weekly_001',
    title: 'Chasseur diversifié',
    description: 'Identifiez 5 espèces différentes cette semaine',
    type: 'weekly',
    requirements: [
      {
        type: 'identify_species',
        target: 5,
        current: 2,
        metadata: { uniqueSpecies: ['1', '2'] },
      },
    ],
    reward: {
      points: 200,
      achievement: 'species_explorer',
    },
    expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'seasonal_001',
    title: 'Maître d\'automne',
    description: 'Trouvez 50 champignons pendant la saison d\'automne',
    type: 'seasonal',
    requirements: [
      {
        type: 'find_mushroom',
        target: 50,
        current: 23,
        metadata: { season: 'autumn' },
      },
    ],
    reward: {
      points: 1000,
      achievement: 'autumn_master',
    },
    expiresAt: '2024-11-30T23:59:59Z',
  },
];

// Mock Achievements
export const mockAchievements: Achievement[] = [
  {
    id: 'first_find',
    title: 'Première trouvaille',
    description: 'Trouvez votre premier champignon',
    icon: '🎯',
    points: 10,
  },
  {
    id: 'rare_hunter',
    title: 'Chasseur de raretés',
    description: 'Trouvez 10 champignons rares ou plus',
    icon: '💎',
    points: 100,
  },
  {
    id: 'species_master',
    title: 'Maître des espèces',
    description: 'Identifiez 50 espèces différentes',
    icon: '📚',
    points: 500,
  },
  {
    id: 'safety_first',
    title: 'Sécurité avant tout',
    description: 'Identifiez correctement 10 champignons toxiques',
    icon: '⚠️',
    points: 50,
  },
];

// Mock Events
export const mockEvents: GameEvent[] = [
  {
    id: 'event_001',
    type: 'community',
    title: 'Chasse aux Cèpes',
    description: 'Trouvez le plus de cèpes possible ce week-end!',
    startDate: '2024-10-19T00:00:00Z',
    endDate: '2024-10-20T23:59:59Z',
    rewards: {
      points: 500,
      badges: ['cepe_weekend_2024'],
    },
    requirements: [
      {
        type: 'find_specific_mushroom',
        mushroomId: '1',
        quantity: 5,
      },
    ],
    participants: 245,
  },
  {
    id: 'event_002',
    type: 'seasonal',
    title: 'Festival d\'Automne',
    description: 'Célébrez la saison des champignons avec des défis quotidiens',
    startDate: '2024-10-01T00:00:00Z',
    endDate: '2024-10-31T23:59:59Z',
    rewards: {
      points: 2000,
      badges: ['autumn_festival_2024'],
      items: ['golden_basket'],
    },
    requirements: [
      {
        type: 'complete_daily_challenges',
        quantity: 20,
      },
    ],
    participants: 1832,
  },
];

// Mock User Stats for Testing
export const mockUserStats = {
  totalMushroomsFound: 127,
  uniqueSpeciesIdentified: 23,
  spotsShared: 15,
  daysActive: 45,
  currentStreak: 7,
  longestStreak: 14,
  favoriteSpot: {
    latitude: 48.8584,
    longitude: 2.2945,
    name: 'Bois de Boulogne',
  },
  rareFinds: [
    { mushroomId: '3', count: 5 },
    { mushroomId: '5', count: 1 },
  ],
};

// Mock Leaderboard Data
export const mockLeaderboardData = [
  {
    rank: 1,
    userId: 'user_001',
    username: 'MycoMaster',
    avatar: '🏆',
    points: 15420,
    level: 42,
    mushroomsFound: 523,
    rareFinds: 28,
  },
  {
    rank: 2,
    userId: 'user_002',
    username: 'ForestExplorer',
    avatar: '🌲',
    points: 14200,
    level: 40,
    mushroomsFound: 489,
    rareFinds: 24,
  },
  {
    rank: 3,
    userId: 'user_003',
    username: 'TruffleHunter',
    avatar: '💎',
    points: 13850,
    level: 39,
    mushroomsFound: 412,
    rareFinds: 31,
  },
];