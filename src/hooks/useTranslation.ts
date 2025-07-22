import { useTranslation as useI18nTranslation } from 'react-i18next';
import { useCallback } from 'react';

export function useTranslation() {
  const { t, i18n } = useI18nTranslation();

  const changeLanguage = useCallback(async (language: string) => {
    await i18n.changeLanguage(language);
  }, [i18n]);

  const formatNumber = useCallback(
    (value: number, options?: Intl.NumberFormatOptions) => {
      return new Intl.NumberFormat(i18n.language, options).format(value);
    },
    [i18n.language]
  );

  const formatDate = useCallback(
    (date: Date | string, options?: Intl.DateTimeFormatOptions) => {
      const dateObj = typeof date === 'string' ? new Date(date) : date;
      return new Intl.DateTimeFormat(i18n.language, options).format(dateObj);
    },
    [i18n.language]
  );

  const formatCurrency = useCallback(
    (value: number, currency: string = 'EUR') => {
      return new Intl.NumberFormat(i18n.language, {
        style: 'currency',
        currency,
      }).format(value);
    },
    [i18n.language]
  );

  const formatDistance = useCallback(
    (meters: number): string => {
      if (i18n.language === 'en') {
        // Convert to miles for English
        const miles = meters * 0.000621371;
        if (miles < 0.1) {
          return `${Math.round(meters * 3.28084)} ft`;
        }
        return `${miles.toFixed(1)} mi`;
      }
      
      // Metric for other languages
      if (meters < 1000) {
        return `${Math.round(meters)} m`;
      }
      return `${(meters / 1000).toFixed(1)} km`;
    },
    [i18n.language]
  );

  return {
    t,
    i18n,
    currentLanguage: i18n.language,
    changeLanguage,
    formatNumber,
    formatDate,
    formatCurrency,
    formatDistance,
  };
}