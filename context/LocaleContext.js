import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const LocaleContext = createContext();

export const LOCALES = {
  ENGLISH: 'en',
  KAZAKH: 'kk',
  RUSSIAN: 'ru',
};

export const LocaleProvider = ({ children }) => {
  const [locale, setLocale] = useState(LOCALES.ENGLISH);

  useEffect(() => {
    // Load saved locale on app start
    loadSavedLocale();
  }, []);

  const loadSavedLocale = async () => {
    try {
      const savedLocale = await AsyncStorage.getItem('app_locale');
      if (savedLocale && Object.values(LOCALES).includes(savedLocale)) {
        setLocale(savedLocale);
      }
    } catch (error) {
      console.error('Error loading saved locale:', error);
    }
  };

  const changeLocale = async (newLocale) => {
    try {
      await AsyncStorage.setItem('app_locale', newLocale);
      setLocale(newLocale);
    } catch (error) {
      console.error('Error saving locale:', error);
    }
  };

  return (
    <LocaleContext.Provider value={{ locale, changeLocale }}>
      {children}
    </LocaleContext.Provider>
  );
};

export const useLocale = () => {
  const context = useContext(LocaleContext);
  if (!context) {
    throw new Error('useLocale must be used within a LocaleProvider');
  }
  return context;
}; 