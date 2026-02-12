export interface User {
  id: string;
  username: string;
  email: string;
  password_hash?: string;
  avatar_url?: string;
  level: number;
  total_points: number;
  experience: number;
  daily_streak: number;
  last_active_date?: Date;
  is_verified: boolean;
  is_expert: boolean;
  preferences: Record<string, any>;
  created_at: Date;
  updated_at: Date;
}

export interface Mushroom {
  id: string;
  name: string;
  scientific_name: string;
  common_names: string[];
  description?: string;
  edibility: 'edible' | 'inedible' | 'poisonous' | 'unknown';
  rarity: 'common' | 'uncommon' | 'rare' | 'very_rare' | 'legendary';
  base_points: number;
  habitat: string[];
  seasons: string[];
  lookalikes: string[];
  warnings: string[];
  image_urls: string[];
  ai_model_confidence_threshold: number;
  created_at: Date;
  updated_at: Date;
}

export interface Spot {
  id: string;
  user_id: string;
  mushroom_id: string;
  location: {
    type: 'Point';
    coordinates: [number, number]; // [longitude, latitude]
  };
  altitude?: number;
  accuracy?: number;
  photos: string[];
  notes?: string;
  confidence_score?: number;
  is_public: boolean;
  is_verified: boolean;
  verified_by?: string;
  verified_at?: Date;
  weather_conditions?: Record<string, any>;
  found_at: Date;
  created_at: Date;
  updated_at: Date;
}

export interface Achievement {
  id: string;
  code: string;
  name: string;
  description?: string;
  icon: string;
  points: number;
  category?: string;
  requirements: Record<string, any>;
  rarity: 'common' | 'uncommon' | 'rare' | 'legendary';
  is_hidden: boolean;
  created_at: Date;
}

export interface Quest {
  id: string;
  code: string;
  title: string;
  description?: string;
  type: 'daily' | 'weekly' | 'seasonal' | 'special';
  requirements: Record<string, any>[];
  rewards: Record<string, any>;
  start_date?: Date;
  end_date?: Date;
  is_active: boolean;
  max_completions: number;
  created_at: Date;
}

export interface UserQuest {
  id: string;
  user_id: string;
  quest_id: string;
  progress: Record<string, any>;
  completed_at?: Date;
  rewards_claimed: boolean;
  created_at: Date;
}

export interface MushroomIdentificationRequest {
  image: string; // Base64 encoded
  location?: {
    latitude: number;
    longitude: number;
  };
  metadata?: Record<string, any>;
}

export interface MushroomIdentificationResponse {
  id: string;
  mushroom: {
    name: string;
    scientific_name: string;
    confidence: number;
  };
  alternativeSuggestions: Array<{
    name: string;
    scientific_name: string;
    confidence: number;
  }>;
  edibility: {
    is_edible: boolean;
    warnings: string[];
    preparation_notes?: string;
  };
  rarity: string;
  points: number;
  timestamp: string;
}

export interface GameEvent {
  id: string;
  title: string;
  description: string;
  type: 'seasonal' | 'community' | 'special';
  start_date: Date;
  end_date: Date;
  rewards: Record<string, any>;
  participants_count: number;
  is_active: boolean;
}
