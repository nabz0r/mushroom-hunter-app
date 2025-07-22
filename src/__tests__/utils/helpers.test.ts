import { 
  formatDate, 
  formatDistance, 
  getRarityColor, 
  validateEmail, 
  validatePassword,
  getCurrentSeason,
  isMushroomInSeason 
} from '@/utils/helpers';

describe('Helpers', () => {
  describe('formatDate', () => {
    beforeEach(() => {
      jest.useFakeTimers();
      jest.setSystemTime(new Date('2024-10-15T12:00:00'));
    });

    afterEach(() => {
      jest.useRealTimers();
    });

    it('formats recent dates correctly', () => {
      const now = new Date();
      expect(formatDate(now)).toBe('À l\'instant');

      const thirtyMinutesAgo = new Date(now.getTime() - 30 * 60 * 1000);
      expect(formatDate(thirtyMinutesAgo)).toBe('Il y a 30 minutes');

      const twoHoursAgo = new Date(now.getTime() - 2 * 60 * 60 * 1000);
      expect(formatDate(twoHoursAgo)).toBe('Il y a 2 heures');

      const threeDaysAgo = new Date(now.getTime() - 3 * 24 * 60 * 60 * 1000);
      expect(formatDate(threeDaysAgo)).toBe('Il y a 3 jours');
    });
  });

  describe('formatDistance', () => {
    it('formats distances correctly', () => {
      expect(formatDistance(500)).toBe('500 m');
      expect(formatDistance(1500)).toBe('1.5 km');
      expect(formatDistance(10250)).toBe('10.3 km');
    });
  });

  describe('getRarityColor', () => {
    it('returns correct colors for rarities', () => {
      expect(getRarityColor('common')).toBe('#6B7280');
      expect(getRarityColor('uncommon')).toBe('#10B981');
      expect(getRarityColor('rare')).toBe('#3B82F6');
      expect(getRarityColor('very_rare')).toBe('#8B5CF6');
      expect(getRarityColor('legendary')).toBe('#F59E0B');
      expect(getRarityColor('unknown')).toBe('#6B7280');
    });
  });

  describe('validateEmail', () => {
    it('validates emails correctly', () => {
      expect(validateEmail('test@example.com')).toBe(true);
      expect(validateEmail('user.name@domain.co.uk')).toBe(true);
      expect(validateEmail('invalid.email')).toBe(false);
      expect(validateEmail('@example.com')).toBe(false);
      expect(validateEmail('test@')).toBe(false);
    });
  });

  describe('validatePassword', () => {
    it('validates passwords correctly', () => {
      const weak = validatePassword('pass');
      expect(weak.isValid).toBe(false);
      expect(weak.errors).toContain('Le mot de passe doit contenir au moins 8 caractères');

      const noUpperCase = validatePassword('password123');
      expect(noUpperCase.isValid).toBe(false);
      expect(noUpperCase.errors).toContain('Le mot de passe doit contenir au moins une majuscule');

      const strong = validatePassword('Password123');
      expect(strong.isValid).toBe(true);
      expect(strong.errors).toHaveLength(0);
    });
  });

  describe('getCurrentSeason', () => {
    it('returns correct season', () => {
      jest.setSystemTime(new Date('2024-01-15'));
      expect(getCurrentSeason()).toBe('winter');

      jest.setSystemTime(new Date('2024-04-15'));
      expect(getCurrentSeason()).toBe('spring');

      jest.setSystemTime(new Date('2024-07-15'));
      expect(getCurrentSeason()).toBe('summer');

      jest.setSystemTime(new Date('2024-10-15'));
      expect(getCurrentSeason()).toBe('autumn');
    });
  });
});