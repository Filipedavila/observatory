import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import moment from 'moment';
import 'moment/locale/pt';
import { translations } from '@a12e/accessmonitor-rulesets';

import { enTranslation } from './locale/English';
import ptJSON from './locale/Portuguese.json';

i18n.use(initReactI18next).init({
  resources: {
    en: { translation: { ...enTranslation.translation, ...translations.en.translation } },
    pt: { translation: { ...ptJSON.translation, ...translations.pt.translation } },
  },
  lng: 'pt',
  fallbackLng: 'en',
  interpolation: { escapeValue: false },
});

function updateMomentLocale() {
  moment.locale(i18n.language);
}

export function getDateFormat(
  date: Date | string | number,
  options: Intl.DateTimeFormatOptions = { dateStyle: 'short' },
  locale?: string
): string {
  try {
    const targetDate = typeof date === 'object' ? date : new Date(date);
    const targetLocale = locale || i18n.resolvedLanguage || i18n.language || 'pt';

    return new Intl.DateTimeFormat(targetLocale, options).format(targetDate);
  } catch (error) {
    console.error('Error formatting date:', error);
    return '';
  }
}

i18n.on('languageChanged', updateMomentLocale);
updateMomentLocale();
