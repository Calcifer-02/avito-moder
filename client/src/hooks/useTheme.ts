import { useEffect } from 'react';
import { useAppSelector, useAppDispatch } from '../store/hooks';
import { toggleTheme as toggleThemeAction, setTheme } from '../store/slices/settingsSlice';
import type { Theme } from '../store/slices/settingsSlice';

/**
 * Хук для управления темой приложения через Redux
 * Тема сохраняется в Redux store и автоматически синхронизируется с localStorage
 */
export const useTheme = () => {
  const dispatch = useAppDispatch();
  const theme = useAppSelector((state) => state.settings.theme);

  // Применяем тему при монтировании компонента
  useEffect(() => {
    const root = document.documentElement;

    if (theme === 'dark') {
      root.setAttribute('data-theme', 'dark');
    } else {
      root.removeAttribute('data-theme');
    }
  }, [theme]);

  // Функция переключения темы
  const toggleTheme = () => {
    dispatch(toggleThemeAction());
  };

  // Функция установки конкретной темы
  const changeTheme = (newTheme: Theme) => {
    dispatch(setTheme(newTheme));
  };

  return {
    theme,
    toggleTheme,
    changeTheme,
    isDark: theme === 'dark',
  };
};

