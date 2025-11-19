import apiClient from './client';
import type { Moderator } from '@/types';

/**
 * Сервис для работы с модераторами
 */
export const moderatorsService = {
  /**
   * Получить информацию о текущем модераторе
   */
  getCurrentModerator: async (): Promise<Moderator> => {
    const response = await apiClient.get<Moderator>('/moderators/me');
    return response.data;
  },
};

