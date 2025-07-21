export interface User {
  id: string;
  username: string;
  email: string;
  level: number;
  points: number;
  avatar?: string;
  joinedAt: string;
  achievements: string[];
  stats: {
    mushroomsFound: number;
    speciesIdentified: number;
    spotsShared: number;
    daysActive: number;
  };
}

export interface MushroomIdentification {
  id: string;
  mushroom: {
    name: string;
    scientificName: string;
    confidence: number;
  };
  alternativeSuggestions: Array<{
    name: string;
    scientificName: string;
    confidence: number;
  }>;
  edibility: {
    isEdible: boolean;
    warnings: string[];
    preparationNotes?: string;
  };
  timestamp: string;
  imageUrl: string;
  location?: {
    latitude: number;
    longitude: number;
  };
}

export type RarityLevel = 'common' | 'uncommon' | 'rare' | 'very_rare' | 'legendary';

export interface GameEvent {
  id: string;
  type: 'seasonal' | 'community' | 'challenge';
  title: string;
  description: string;
  startDate: string;
  endDate: string;
  rewards: {
    points: number;
    badges?: string[];
    items?: string[];
  };
  requirements: any[];
  participants: number;
}