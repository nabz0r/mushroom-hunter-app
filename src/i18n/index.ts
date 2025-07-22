import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import * as Localization from 'expo-localization';
import AsyncStorage from '@react-native-async-storage/async-storage';

import en from './locales/en.json';
import fr from './locales/fr.json';
import es from './locales/es.json';
import de from './locales/de.json';
import it from './locales/it.json';

const LANGUAGE_KEY = '@app_language';

const resources = {
  en: { translation: en },
  fr: { translation: fr },
  es: { translation: es },
  de: { translation: de },
  it: { translation: it },
};

const initI18n = async () => {
  // Get saved language or use device language
  let savedLanguage = await AsyncStorage.getItem(LANGUAGE_KEY);
  
  if (!savedLanguage) {
    // Get device language
    const deviceLanguage = Localization.locale.split('-')[0];
    savedLanguage = Object.keys(resources).includes(deviceLanguage)
      ? deviceLanguage
      : 'en';
  }

  i18n
    .use(initReactI18next)
    .init({
      compatibilityJSON: 'v3',
      resources,
      lng: savedLanguage,
      fallbackLng: 'en',
      interpolation: {
        escapeValue: false,
      },
      react: {
        useSuspense: false,
      },
    });
};

// Save language preference
export const changeLanguage = async (language: string) => {
  await AsyncStorage.setItem(LANGUAGE_KEY, language);
  await i18n.changeLanguage(language);
};

// Get available languages
export const getAvailableLanguages = () => [
  { code: 'en', name: 'English', flag: '🇬🇧' },
  { code: 'fr', name: 'Français', flag: '🇫🇷' },
  { code: 'es', name: 'Español', flag: '🇪🇸' },
  { code: 'de', name: 'Deutsch', flag: '🇩🇪' },
  { code: 'it', name: 'Italiano', flag: '🇮🇹' },
];

initI18n();

export default i18n;