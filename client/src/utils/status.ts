import type { AdStatus, AdPriority } from '@/types';

/**
 * Получить цвет бейджа статуса
 */
export const getStatusColor = (status: AdStatus): string => {
  const colors: Record<AdStatus, string> = {
    pending: '#FFA500',
    approved: '#4CAF50',
    rejected: '#F44336',
    draft: '#9E9E9E',
  };
  return colors[status];
};

/**
 * Получить текст статуса на русском
 */
export const getStatusText = (status: AdStatus): string => {
  const texts: Record<AdStatus, string> = {
    pending: 'На модерации',
    approved: 'Одобрено',
    rejected: 'Отклонено',
    draft: 'Черновик',
  };
  return texts[status];
};

/**
 * Получить цвет приоритета
 */
export const getPriorityColor = (priority: AdPriority): string => {
  const colors: Record<AdPriority, string> = {
    normal: '#2196F3',
    urgent: '#FF5722',
  };
  return colors[priority];
};

/**
 * Получить текст приоритета на русском
 */
export const getPriorityText = (priority: AdPriority): string => {
  const texts: Record<AdPriority, string> = {
    normal: 'Обычный',
    urgent: 'Срочный',
  };
  return texts[priority];
};

/**
 * Получить иконку приоритета
 */
export const getPriorityIcon = (priority: AdPriority): string => {
  const icons: Record<AdPriority, string> = {
    normal: '●',
    urgent: '🔥',
  };
  return icons[priority];
};

