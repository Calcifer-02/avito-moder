import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';

export type Theme = 'light' | 'dark';

interface SettingsState {
  theme: Theme;
  // Другие настройки можно добавить сюда
  language: string;
  notificationsEnabled: boolean;
}

// Загрузка состояния из localStorage
const loadStateFromLocalStorage = (): Partial<SettingsState> => {
  try {
    const theme = localStorage.getItem('theme') as Theme | null;
    const language = localStorage.getItem('language');
    const notificationsEnabled = localStorage.getItem('notificationsEnabled');

    return {
      theme: theme || undefined,
      language: language || undefined,
      notificationsEnabled: notificationsEnabled ? JSON.parse(notificationsEnabled) : undefined,
    };
  } catch (error) {
    console.error('Error loading state from localStorage:', error);
    return {};
  }
};

// Определение системной темы
const getSystemTheme = (): Theme => {
  if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
    return 'dark';
  }
  return 'light';
};

// Начальное состояние с приоритетом: localStorage -> системная тема -> дефолт
const savedState = loadStateFromLocalStorage();
const initialState: SettingsState = {
  theme: savedState.theme || getSystemTheme(),
  language: savedState.language || 'ru',
  notificationsEnabled: savedState.notificationsEnabled ?? true,
};

const settingsSlice = createSlice({
  name: 'settings',
  initialState,
  reducers: {
    setTheme: (state, action: PayloadAction<Theme>) => {
      state.theme = action.payload;
      // Сохранение в localStorage
      localStorage.setItem('theme', action.payload);
      // Применение темы к DOM
      if (action.payload === 'dark') {
        document.documentElement.setAttribute('data-theme', 'dark');
      } else {
        document.documentElement.removeAttribute('data-theme');
      }
    },
    toggleTheme: (state) => {
      const newTheme: Theme = state.theme === 'light' ? 'dark' : 'light';
      state.theme = newTheme;
      // Сохранение в localStorage
      localStorage.setItem('theme', newTheme);
      // Применение темы к DOM
      if (newTheme === 'dark') {
        document.documentElement.setAttribute('data-theme', 'dark');
      } else {
        document.documentElement.removeAttribute('data-theme');
      }
    },
    setLanguage: (state, action: PayloadAction<string>) => {
      state.language = action.payload;
      localStorage.setItem('language', action.payload);
    },
    setNotificationsEnabled: (state, action: PayloadAction<boolean>) => {
      state.notificationsEnabled = action.payload;
      localStorage.setItem('notificationsEnabled', JSON.stringify(action.payload));
    },
  },
});

export const { setTheme, toggleTheme, setLanguage, setNotificationsEnabled } = settingsSlice.actions;
export default settingsSlice.reducer;

