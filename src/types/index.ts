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
  alternative_suggestions: Array<{
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

// 📁 src/models/User.ts
import { db } from '@/config/database';
import { User } from '@/types';
import bcrypt from 'bcryptjs';

export class UserModel {
  static async create(userData: Partial<User> & { password: string }): Promise<User> {
    const { password, ...userFields } = userData;
    const password_hash = await bcrypt.hash(password, 12);

    const [user] = await db('users')
      .insert({
        ...userFields,
        password_hash,
      })
      .returning('*');

    delete user.password_hash;
    return user;
  }

  static async findById(id: string): Promise<User | null> {
    const user = await db('users')
      .where({ id })
      .select('*')
      .first();

    if (user) {
      delete user.password_hash;
    }
    return user || null;
  }

  static async findByEmail(email: string): Promise<User | null> {
    const user = await db('users')
      .where({ email })
      .select('*')
      .first();

    return user || null;
  }

  static async findByUsername(username: string): Promise<User | null> {
    const user = await db('users')
      .where({ username })
      .select('*')
      .first();

    if (user) {
      delete user.password_hash;
    }
    return user || null;
  }

  static async updateById(id: string, updates: Partial<User>): Promise<User | null> {
    const [user] = await db('users')
      .where({ id })
      .update({ ...updates, updated_at: new Date() })
      .returning('*');

    if (user) {
      delete user.password_hash;
    }
    return user || null;
  }

  static async verifyPassword(email: string, password: string): Promise<User | null> {
    const user = await db('users')
      .where({ email })
      .select('*')
      .first();

    if (!user) return null;

    const isValid = await bcrypt.compare(password, user.password_hash);
    if (!isValid) return null;

    delete user.password_hash;
    return user;
  }

  static async updateDailyStreak(userId: string): Promise<void> {
    const user = await db('users')
      .where({ id: userId })
      .select('last_active_date', 'daily_streak')
      .first();

    if (!user) return;

    const today = new Date().toDateString();
    const lastActive = user.last_active_date ? new Date(user.last_active_date).toDateString() : null;

    let newStreak = user.daily_streak || 0;

    if (lastActive === today) {
      // Already active today, no change
      return;
    }

    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayStr = yesterday.toDateString();

    if (lastActive === yesterdayStr) {
      // Consecutive day
      newStreak += 1;
    } else {
      // Streak broken
      newStreak = 1;
    }

    await db('users')
      .where({ id: userId })
      .update({
        daily_streak: newStreak,
        last_active_date: new Date(),
        updated_at: new Date(),
      });
  }

  static async addPoints(userId: string, points: number): Promise<void> {
    await db('users')
      .where({ id: userId })
      .increment('total_points', points)
      .increment('experience', points)
      .update('updated_at', new Date());

    // Check for level up
    const user = await db('users')
      .where({ id: userId })
      .select('level', 'experience')
      .first();

    if (user) {
      const experienceNeeded = user.level * 1000; // Simple formula
      if (user.experience >= experienceNeeded) {
        await db('users')
          .where({ id: userId })
          .update({
            level: user.level + 1,
            experience: user.experience - experienceNeeded,
            updated_at: new Date(),
          });
      }
    }
  }

  static async getLeaderboard(
    period: 'daily' | 'weekly' | 'monthly' | 'all',
    limit: number = 100
  ): Promise<Array<User & { rank: number; spots_found: number }>> {
    let dateFilter = '';
    
    switch (period) {
      case 'daily':
        dateFilter = "AND s.found_at >= date_trunc('day', NOW())";
        break;
      case 'weekly':
        dateFilter = "AND s.found_at >= date_trunc('week', NOW())";
        break;
      case 'monthly':
        dateFilter = "AND s.found_at >= date_trunc('month', NOW())";
        break;
      default:
        dateFilter = '';
    }

    const query = `
      SELECT 
        u.id,
        u.username,
        u.avatar_url,
        u.level,
        u.total_points,
        COUNT(s.id) as spots_found,
        RANK() OVER (ORDER BY u.total_points DESC) as rank
      FROM users u
      LEFT JOIN spots s ON u.id = s.user_id ${dateFilter}
      GROUP BY u.id, u.username, u.avatar_url, u.level, u.total_points
      ORDER BY u.total_points DESC
      LIMIT ?
    `;

    return await db.raw(query, [limit]).then(result => result.rows);
  }
}

// 📁 src/models/Mushroom.ts
import { db } from '@/config/database';
import { Mushroom } from '@/types';

export class MushroomModel {
  static async findAll(filters?: {
    edibility?: string;
    rarity?: string;
    season?: string;
    search?: string;
  }): Promise<Mushroom[]> {
    let query = db('mushrooms').select('*');

    if (filters?.edibility) {
      query = query.where('edibility', filters.edibility);
    }

    if (filters?.rarity) {
      query = query.where('rarity', filters.rarity);
    }

    if (filters?.season) {
      query = query.whereJsonSupersetOf('seasons', [filters.season]);
    }

    if (filters?.search) {
      query = query.where(function() {
        this.whereILike('name', `%${filters.search}%`)
          .orWhereILike('scientific_name', `%${filters.search}%`)
          .orWhereJsonSupersetOf('common_names', [filters.search]);
      });
    }

    return await query.orderBy('name');
  }

  static async findById(id: string): Promise<Mushroom | null> {
    const mushroom = await db('mushrooms')
      .where({ id })
      .select('*')
      .first();

    return mushroom || null;
  }

  static async findByName(name: string): Promise<Mushroom | null> {
    const mushroom = await db('mushrooms')
      .where('name', 'ilike', name)
      .orWhere('scientific_name', 'ilike', name)
      .orWhereJsonSupersetOf('common_names', [name])
      .select('*')
      .first();

    return mushroom || null;
  }

  static async create(mushroomData: Omit<Mushroom, 'id' | 'created_at' | 'updated_at'>): Promise<Mushroom> {
    const [mushroom] = await db('mushrooms')
      .insert(mushroomData)
      .returning('*');

    return mushroom;
  }

  static async updateById(id: string, updates: Partial<Mushroom>): Promise<Mushroom | null> {
    const [mushroom] = await db('mushrooms')
      .where({ id })
      .update({ ...updates, updated_at: new Date() })
      .returning('*');

    return mushroom || null;
  }

  static async getPopular(limit: number = 10): Promise<Array<Mushroom & { spot_count: number }>> {
    const query = `
      SELECT 
        m.*,
        COUNT(s.id) as spot_count
      FROM mushrooms m
      LEFT JOIN spots s ON m.id = s.mushroom_id
      WHERE s.found_at >= NOW() - INTERVAL '30 days'
      GROUP BY m.id
      ORDER BY spot_count DESC
      LIMIT ?
    `;

    return await db.raw(query, [limit]).then(result => result.rows);
  }

  static async getSeasonalMushrooms(season: string): Promise<Mushroom[]> {
    return await db('mushrooms')
      .whereJsonSupersetOf('seasons', [season])
      .select('*')
      .orderBy('rarity', 'desc')
      .orderBy('name');
  }
}

// 📁 src/models/Spot.ts
import { db } from '@/config/database';
import { Spot } from '@/types';

export class SpotModel {
  static async create(spotData: Omit<Spot, 'id' | 'created_at' | 'updated_at'>): Promise<Spot> {
    const [spot] = await db('spots')
      .insert({
        ...spotData,
        location: db.raw('ST_GeomFromGeoJSON(?)', [JSON.stringify(spotData.location)]),
      })
      .returning('*');

    return spot;
  }

  static async findById(id: string): Promise<Spot | null> {
    const spot = await db('spots')
      .where({ id })
      .select('*', db.raw('ST_AsGeoJSON(location) as location'))
      .first();

    if (spot && spot.location) {
      spot.location = JSON.parse(spot.location);
    }

    return spot || null;
  }

  static async findNearby(
    latitude: number,
    longitude: number,
    radiusMeters: number = 5000,
    filters?: {
      isPublic?: boolean;
      isVerified?: boolean;
      mushroomId?: string;
      userId?: string;
    }
  ): Promise<Array<Spot & { distance: number; mushroom_name: string; user_name: string }>> {
    let query = db('spots as s')
      .join('mushrooms as m', 's.mushroom_id', 'm.id')
      .join('users as u', 's.user_id', 'u.id')
      .select(
        's.*',
        'm.name as mushroom_name',
        'u.username as user_name',
        db.raw('ST_Distance(s.location, ST_GeogFromText(?)) as distance', 
          [`POINT(${longitude} ${latitude})`]
        )
      )
      .where(
        db.raw('ST_DWithin(s.location, ST_GeogFromText(?), ?)', 
          [`POINT(${longitude} ${latitude})`, radiusMeters]
        )
      );

    if (filters?.isPublic !== undefined) {
      query = query.where('s.is_public', filters.isPublic);
    }

    if (filters?.isVerified !== undefined) {
      query = query.where('s.is_verified', filters.isVerified);
    }

    if (filters?.mushroomId) {
      query = query.where('s.mushroom_id', filters.mushroomId);
    }

    if (filters?.userId) {
      query = query.where('s.user_id', filters.userId);
    }

    const spots = await query.orderBy('distance').limit(100);

    return spots.map(spot => ({
      ...spot,
      location: JSON.parse(spot.location),
    }));
  }

  static async findByUserId(userId: string, limit: number = 50): Promise<Spot[]> {
    const spots = await db('spots')
      .where({ user_id: userId })
      .select('*', db.raw('ST_AsGeoJSON(location) as location'))
      .orderBy('found_at', 'desc')
      .limit(limit);

    return spots.map(spot => ({
      ...spot,
      location: JSON.parse(spot.location),
    }));
  }

  static async updateById(id: string, updates: Partial<Spot>): Promise<Spot | null> {
    const updateData = { ...updates, updated_at: new Date() };
    
    if (updates.location) {
      updateData.location = db.raw('ST_GeomFromGeoJSON(?)', [JSON.stringify(updates.location)]);
    }

    const [spot] = await db('spots')
      .where({ id })
      .update(updateData)
      .returning('*');

    if (spot && spot.location) {
      spot.location = JSON.parse(spot.location);
    }

    return spot || null;
  }

  static async deleteById(id: string): Promise<boolean> {
    const deleted = await db('spots')
      .where({ id })
      .del();

    return deleted > 0;
  }

  static async getUserStats(userId: string): Promise<{
    total_spots: number;
    unique_species: number;
    verified_spots: number;
    total_points: number;
  }> {
    const stats = await db('spots as s')
      .join('mushrooms as m', 's.mushroom_id', 'm.id')
      .where('s.user_id', userId)
      .select(
        db.raw('COUNT(*) as total_spots'),
        db.raw('COUNT(DISTINCT s.mushroom_id) as unique_species'),
        db.raw('COUNT(*) FILTER (WHERE s.is_verified = true) as verified_spots'),
        db.raw('SUM(m.base_points) as total_points')
      )
      .first();

    return {
      total_spots: parseInt(stats.total_spots) || 0,
      unique_species: parseInt(stats.unique_species) || 0,
      verified_spots: parseInt(stats.verified_spots) || 0,
      total_points: parseInt(stats.total_points) || 0,
    };
  }
}
