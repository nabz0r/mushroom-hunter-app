import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  points: number;
  unlockedAt?: string;
}

export interface Quest {
  id: string;
  title: string;
  description: string;
  type: 'daily' | 'weekly' | 'seasonal';
  requirements: {
    type: 'find_mushroom' | 'identify_species' | 'visit_location' | 'share_spot';
    target: number;
    current: number;
    metadata?: any;
  }[];
  reward: {
    points: number;
    achievement?: string;
  };
  expiresAt: string;
  completedAt?: string;
}

interface GameState {
  achievements: Achievement[];
  unlockedAchievements: string[];
  activeQuests: Quest[];
  completedQuests: string[];
  dailyStreak: number;
  lastActiveDate: string | null;
  totalPoints: number;
  level: number;
  experience: number;
  experienceToNextLevel: number;
}

const initialState: GameState = {
  achievements: [],
  unlockedAchievements: [],
  activeQuests: [],
  completedQuests: [],
  dailyStreak: 0,
  lastActiveDate: null,
  totalPoints: 0,
  level: 1,
  experience: 0,
  experienceToNextLevel: 100,
};

const gameSlice = createSlice({
  name: 'game',
  initialState,
  reducers: {
    unlockAchievement: (state, action: PayloadAction<string>) => {
      if (!state.unlockedAchievements.includes(action.payload)) {
        state.unlockedAchievements.push(action.payload);
      }
    },
    updateQuestProgress: (state, action: PayloadAction<{ questId: string; requirementIndex: number; progress: number }>) => {
      const quest = state.activeQuests.find(q => q.id === action.payload.questId);
      if (quest) {
        quest.requirements[action.payload.requirementIndex].current = action.payload.progress;
      }
    },
    completeQuest: (state, action: PayloadAction<string>) => {
      const questIndex = state.activeQuests.findIndex(q => q.id === action.payload);
      if (questIndex !== -1) {
        const quest = state.activeQuests[questIndex];
        quest.completedAt = new Date().toISOString();
        state.completedQuests.push(quest.id);
        state.totalPoints += quest.reward.points;
        state.activeQuests.splice(questIndex, 1);
      }
    },
    addExperience: (state, action: PayloadAction<number>) => {
      state.experience += action.payload;
      while (state.experience >= state.experienceToNextLevel) {
        state.experience -= state.experienceToNextLevel;
        state.level += 1;
        state.experienceToNextLevel = Math.floor(state.experienceToNextLevel * 1.5);
      }
    },
    updateDailyStreak: (state) => {
      const today = new Date().toDateString();
      const lastActive = state.lastActiveDate ? new Date(state.lastActiveDate).toDateString() : null;
      
      if (lastActive === today) {
        return;
      }
      
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      
      if (lastActive === yesterday.toDateString()) {
        state.dailyStreak += 1;
      } else {
        state.dailyStreak = 1;
      }
      
      state.lastActiveDate = new Date().toISOString();
    },
  },
});

export const {
  unlockAchievement,
  updateQuestProgress,
  completeQuest,
  addExperience,
  updateDailyStreak,
} = gameSlice.actions;

export default gameSlice.reducer;