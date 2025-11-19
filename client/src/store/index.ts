import { configureStore } from '@reduxjs/toolkit';
import settingsReducer from './slices/settingsSlice';

/**
 * Redux Store для управления глобальным состоянием приложения
 *
 * Включает:
 * - settings: настройки приложения (тема, язык, уведомления)
 */
export const store = configureStore({
  reducer: {
    settings: settingsReducer,
    // Здесь можно добавить другие slices:
    // user: userReducer,
    // filters: filtersReducer,
    // etc.
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // Игнорируем действия, которые могут содержать несериализуемые значения
        ignoredActions: [],
      },
    }),
  devTools: import.meta.env.MODE !== 'production',
});

// Типы для использования в компонентах
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

