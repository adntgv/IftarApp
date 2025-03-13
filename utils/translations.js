import en from '../translations/en';
import kk from '../translations/kk';
import ru from '../translations/ru';
import { LOCALES } from '../context/LocaleContext';

const translations = {
  [LOCALES.ENGLISH]: en,
  [LOCALES.KAZAKH]: kk,
  [LOCALES.RUSSIAN]: ru,
};

export const getTranslation = (locale) => {
  return translations[locale] || translations[LOCALES.ENGLISH];
};

export const translate = (locale, path) => {
  const translation = getTranslation(locale);
  return path.split('.').reduce((obj, key) => obj?.[key], translation) || path;
}; 