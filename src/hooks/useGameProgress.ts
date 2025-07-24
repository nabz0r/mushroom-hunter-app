import { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '@/store';
import { 
  updateQuestProgress, 
  completeQuest, 
  unlockAchievement,
  addExperience,
  updateDailyStreak 
} from '@/store/slices/gameSlice';
import { gameService } from '@/services/gameService';
import { analyticsService } from '@/services/analyticsService';
import { notificationService } from '@/services/notificationService';

export function useGameProgress() {
  const dispatch = useAppDispatch();
  const { 
    activeQuests, 
    unlockedAchievements, 
    dailyStreak, 
    level,
    totalPoints 
  } = useAppSelector(state => state.game);
  
  const [isLoading, setIsLoading] = useState(false);

  // Check for quest completion
  const checkQuestCompletion = (questId: string) => {
    const quest = activeQuests.find(q => q.id === questId);
    if (!quest) return;

    const isCompleted = quest.requirements.every(req => req.current >= req.target);
    
    if (isCompleted && !quest.completedAt) {
      dispatch(completeQuest(questId));
      dispatch(addExperience(quest.reward.points));
      
      // Track quest completion
      analyticsService.trackQuestCompleted({
        id: quest.id,
        type: quest.type,
        reward: quest.reward.points,
      });
      
      // Show notification
      notificationService.notifyQuestCompleted(
        quest.title, 
        quest.reward.points
      );
      
      // Check for achievement unlock
      if (quest.reward.achievement) {
        dispatch(unlockAchievement(quest.reward.achievement));
        notificationService.notifyAchievementUnlocked(
          quest.reward.achievement,
          'Quête terminée !'
        );
      }
    }
  };

  // Track mushroom finding progress
  const trackMushroomFound = (mushroomId: string, rarity: string) => {
    // Update daily quest progress
    const dailyQuest = activeQuests.find(q => 
      q.type === 'daily' && 
      q.requirements.some(req => req.type === 'find_mushroom')
    );
    
    if (dailyQuest) {
      const reqIndex = dailyQuest.requirements.findIndex(req => req.type === 'find_mushroom');
      if (reqIndex !== -1) {
        dispatch(updateQuestProgress({
          questId: dailyQuest.id,
          requirementIndex: reqIndex,
          progress: dailyQuest.requirements[reqIndex].current + 1,
        }));
        checkQuestCompletion(dailyQuest.id);
      }
    }

    // Update species identification quest
    const speciesQuest = activeQuests.find(q => 
      q.requirements.some(req => req.type === 'identify_species')
    );
    
    if (speciesQuest) {
      const reqIndex = speciesQuest.requirements.findIndex(req => req.type === 'identify_species');
      if (reqIndex !== -1) {
        const requirement = speciesQuest.requirements[reqIndex];
        const uniqueSpecies = requirement.metadata?.uniqueSpecies || [];
        
        if (!uniqueSpecies.includes(mushroomId)) {
          uniqueSpecies.push(mushroomId);
          dispatch(updateQuestProgress({
            questId: speciesQuest.id,
            requirementIndex: reqIndex,
            progress: uniqueSpecies.length,
          }));
          checkQuestCompletion(speciesQuest.id);
        }
      }
    }

    // Check for achievements
    checkAchievements(mushroomId, rarity);
  };

  const checkAchievements = (mushroomId: string, rarity: string) => {
    // First find achievement
    if (!unlockedAchievements.includes('first_find')) {
      dispatch(unlockAchievement('first_find'));
      notificationService.notifyAchievementUnlocked(
        'Première trouvaille',
        'Votre premier champignon !'
      );
    }

    // Rare hunter achievement
    if (rarity === 'rare' && !unlockedAchievements.includes('rare_hunter')) {
      // This would check actual count from backend
      dispatch(unlockAchievement('rare_hunter'));
    }
  };

  // Update daily streak
  const updateStreak = () => {
    dispatch(updateDailyStreak());
  };

  // Load quests from server
  const loadQuests = async () => {
    setIsLoading(true);
    try {
      const quests = await gameService.getQuests();
      // This would update the store with fresh quests
    } catch (error) {
      console.error('Failed to load quests:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    updateStreak();
    loadQuests();
  }, []);

  return {
    activeQuests,
    unlockedAchievements,
    dailyStreak,
    level,
    totalPoints,
    isLoading,
    trackMushroomFound,
    checkQuestCompletion,
    loadQuests,
  };
}