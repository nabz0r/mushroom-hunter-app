import api from './api';
import { API_ENDPOINTS } from '@/utils/constants';
import { Quest, Achievement } from '@/store/slices/gameSlice';
import { GameEvent } from '@/types';

interface LeaderboardEntry {
  rank: number;
  userId: string;
  username: string;
  avatar?: string;
  points: number;
  level: number;
  mushroomsFound: number;
}

interface GameStats {
  totalPlayers: number;
  activePlayers: number;
  totalMushroomsFound: number;
  rareFindsToday: number;
}

export const gameService = {
  async getQuests(): Promise<Quest[]> {
    const response = await api.get<Quest[]>(API_ENDPOINTS.GAME.QUESTS);
    return response.data;
  },

  async completeQuest(questId: string): Promise<{ points: number; rewards: any[] }> {
    const response = await api.post(`/game/quests/${questId}/complete`);
    return response.data;
  },

  async getLeaderboard(
    period: 'daily' | 'weekly' | 'monthly' | 'all-time' = 'weekly',
    limit: number = 100
  ): Promise<LeaderboardEntry[]> {
    const response = await api.get<LeaderboardEntry[]>(API_ENDPOINTS.GAME.LEADERBOARD, {
      params: { period, limit },
    });
    return response.data;
  },

  async getAchievements(): Promise<Achievement[]> {
    const response = await api.get<Achievement[]>('/game/achievements');
    return response.data;
  },

  async claimAchievement(achievementId: string): Promise<{ points: number }> {
    const response = await api.post(`/game/achievements/${achievementId}/claim`);
    return response.data;
  },

  async getCurrentEvents(): Promise<GameEvent[]> {
    const response = await api.get<GameEvent[]>(API_ENDPOINTS.GAME.EVENTS);
    return response.data;
  },

  async joinEvent(eventId: string): Promise<void> {
    await api.post(`/game/events/${eventId}/join`);
  },

  async getGameStats(): Promise<GameStats> {
    const response = await api.get<GameStats>('/game/stats');
    return response.data;
  },

  async reportDailyLogin(): Promise<{ streak: number; reward: number }> {
    const response = await api.post('/game/daily-login');
    return response.data;
  },

  calculatePointsForFind(
    rarity: string,
    conditions: {
      isFirstOfDay?: boolean;
      isNewZone?: boolean;
      perfectPhoto?: boolean;
      groupHunt?: boolean;
      weatherBonus?: number;
    }
  ): number {
    const basePoints = {
      common: 15,
      uncommon: 45,
      rare: 95,
      very_rare: 225,
      legendary: 700,
    }[rarity] || 10;

    let multiplier = 1;

    if (conditions.isFirstOfDay) multiplier *= 2;
    if (conditions.isNewZone) multiplier *= 1.5;
    if (conditions.perfectPhoto) multiplier *= 1.3;
    if (conditions.groupHunt) multiplier *= 1.2;
    if (conditions.weatherBonus) multiplier *= conditions.weatherBonus;

    return Math.round(basePoints * multiplier);
  },
};