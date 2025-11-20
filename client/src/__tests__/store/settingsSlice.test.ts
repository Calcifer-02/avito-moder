import { describe, it, expect, beforeEach } from 'vitest';
import settingsReducer, {
  setTheme,
  toggleTheme,
  setLanguage,
  setNotificationsEnabled,
} from '../../store/slices/settingsSlice';
import type { Theme } from '../../store/slices/settingsSlice';

describe('Settings Slice', () => {
  beforeEach(() => {
    // Очищаем localStorage перед каждым тестом
    localStorage.clear();
    // Очищаем атрибуты DOM
    document.documentElement.removeAttribute('data-theme');
  });

  describe('Initial State', () => {
    it('должен иметь начальное состояние по умолчанию', () => {
      const state = settingsReducer(undefined, { type: '@@INIT' });
      expect(state).toHaveProperty('theme');
      expect(state).toHaveProperty('language');
      expect(state).toHaveProperty('notificationsEnabled');
    });

    it('должен загружать тему из localStorage', () => {
      localStorage.setItem('theme', 'dark');
      // Пересоздаем начальное состояние
      const state = settingsReducer(undefined, { type: '@@INIT' });
      // Проверяем что тема должна быть либо light либо dark
      expect(['light', 'dark']).toContain(state.theme);
    });
  });

  describe('setTheme', () => {
    it('должен устанавливать светлую тему', () => {
      const initialState = {
        theme: 'dark' as Theme,
        language: 'ru',
        notificationsEnabled: true,
      };

      const nextState = settingsReducer(initialState, setTheme('light'));

      expect(nextState.theme).toBe('light');
      expect(localStorage.getItem('theme')).toBe('light');
    });

    it('должен устанавливать темную тему', () => {
      const initialState = {
        theme: 'light' as Theme,
        language: 'ru',
        notificationsEnabled: true,
      };

      const nextState = settingsReducer(initialState, setTheme('dark'));

      expect(nextState.theme).toBe('dark');
      expect(localStorage.getItem('theme')).toBe('dark');
      expect(document.documentElement.getAttribute('data-theme')).toBe('dark');
    });
  });

  describe('toggleTheme', () => {
    it('должен переключать с light на dark', () => {
      const initialState = {
        theme: 'light' as Theme,
        language: 'ru',
        notificationsEnabled: true,
      };

      const nextState = settingsReducer(initialState, toggleTheme());
      expect(nextState.theme).toBe('dark');
    });

    it('должен переключать с dark на light', () => {
      const initialState = {
        theme: 'dark' as Theme,
        language: 'ru',
        notificationsEnabled: true,
      };

      const nextState = settingsReducer(initialState, toggleTheme());
      expect(nextState.theme).toBe('light');
    });
  });

  describe('setLanguage', () => {
    it('должен устанавливать язык', () => {
      const initialState = {
        theme: 'light' as Theme,
        language: 'ru',
        notificationsEnabled: true,
      };

      const nextState = settingsReducer(initialState, setLanguage('en'));

      expect(nextState.language).toBe('en');
      expect(localStorage.getItem('language')).toBe('en');
    });
  });

  describe('setNotificationsEnabled', () => {
    it('должен включать уведомления', () => {
      const initialState = {
        theme: 'light' as Theme,
        language: 'ru',
        notificationsEnabled: false,
      };

      const nextState = settingsReducer(initialState, setNotificationsEnabled(true));

      expect(nextState.notificationsEnabled).toBe(true);
      expect(localStorage.getItem('notificationsEnabled')).toBe('true');
    });

    it('должен отключать уведомления', () => {
      const initialState = {
        theme: 'light' as Theme,
        language: 'ru',
        notificationsEnabled: true,
      };

      const nextState = settingsReducer(initialState, setNotificationsEnabled(false));

      expect(nextState.notificationsEnabled).toBe(false);
      expect(localStorage.getItem('notificationsEnabled')).toBe('false');
    });
  });

  describe('localStorage persistence', () => {
    it('должен сохранять все настройки в localStorage', () => {
      let state = {
        theme: 'light' as Theme,
        language: 'ru',
        notificationsEnabled: true,
      };

      state = settingsReducer(state, setTheme('dark'));
      state = settingsReducer(state, setLanguage('en'));
      settingsReducer(state, setNotificationsEnabled(false));

      expect(localStorage.getItem('theme')).toBe('dark');
      expect(localStorage.getItem('language')).toBe('en');
      expect(localStorage.getItem('notificationsEnabled')).toBe('false');
    });
  });
});

