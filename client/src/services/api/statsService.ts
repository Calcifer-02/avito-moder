import apiClient from './client';
import type {
  StatsSummary,
  ActivityData,
  DecisionsData,
  CategoriesData,
  StatsFilters,
} from '@/types';

/**
 * Сервис для работы со статистикой
 */
export const statsService = {
  /**
   * Получить общую статистику модератора
   */
  getSummary: async (filters?: StatsFilters): Promise<StatsSummary> => {
    const params = new URLSearchParams();

    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          params.append(key, String(value));
        }
      });
    }

    const response = await apiClient.get<StatsSummary>(
      `/stats/summary?${params.toString()}`
    );
    return response.data;
  },

  /**
   * Получить данные графика активности
   */
  getActivityChart: async (filters?: StatsFilters): Promise<ActivityData[]> => {
    const params = new URLSearchParams();

    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          params.append(key, String(value));
        }
      });
    }

    const response = await apiClient.get<ActivityData[]>(
      `/stats/chart/activity?${params.toString()}`
    );
    return response.data;
  },

  /**
   * Получить данные графика решений
   */
  getDecisionsChart: async (filters?: StatsFilters): Promise<DecisionsData> => {
    const params = new URLSearchParams();

    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          params.append(key, String(value));
        }
      });
    }

    const response = await apiClient.get<DecisionsData>(
      `/stats/chart/decisions?${params.toString()}`
    );
    return response.data;
  },

  /**
   * Получить данные графика категорий
   */
  getCategoriesChart: async (filters?: StatsFilters): Promise<CategoriesData> => {
    const params = new URLSearchParams();

    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          params.append(key, String(value));
        }
      });
    }

    const response = await apiClient.get<CategoriesData>(
      `/stats/chart/categories?${params.toString()}`
    );
    return response.data;
  },
};

