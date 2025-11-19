import { useQuery } from '@tanstack/react-query';
import { statsService } from '@services/api';
import type { StatsFilters } from '@/types';

/**
 * Ключи для кеширования запросов статистики
 */
export const statsKeys = {
  all: ['stats'] as const,
  summary: (filters: StatsFilters) => [...statsKeys.all, 'summary', filters] as const,
  activity: (filters: StatsFilters) => [...statsKeys.all, 'activity', filters] as const,
  decisions: (filters: StatsFilters) => [...statsKeys.all, 'decisions', filters] as const,
  categories: (filters: StatsFilters) => [...statsKeys.all, 'categories', filters] as const,
};

/**
 * Хук для получения общей статистики
 */
export const useStatsSummary = (filters?: StatsFilters) => {
  return useQuery({
    queryKey: statsKeys.summary(filters || {}),
    queryFn: () => statsService.getSummary(filters),
    staleTime: 60000, // 1 минута
  });
};

/**
 * Хук для получения данных графика активности
 */
export const useActivityChart = (filters?: StatsFilters) => {
  return useQuery({
    queryKey: statsKeys.activity(filters || {}),
    queryFn: () => statsService.getActivityChart(filters),
    staleTime: 60000,
  });
};

/**
 * Хук для получения данных графика решений
 */
export const useDecisionsChart = (filters?: StatsFilters) => {
  return useQuery({
    queryKey: statsKeys.decisions(filters || {}),
    queryFn: () => statsService.getDecisionsChart(filters),
    staleTime: 60000,
  });
};

/**
 * Хук для получения данных графика категорий
 */
export const useCategoriesChart = (filters?: StatsFilters) => {
  return useQuery({
    queryKey: statsKeys.categories(filters || {}),
    queryFn: () => statsService.getCategoriesChart(filters),
    staleTime: 60000,
  });
};

