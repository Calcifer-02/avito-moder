import { useQuery } from '@tanstack/react-query';
import { moderatorsService } from '@services/api';

/**
 * Ключи для кеширования запросов модераторов
 */
export const moderatorsKeys = {
  all: ['moderators'] as const,
  current: () => [...moderatorsKeys.all, 'current'] as const,
};

/**
 * Хук для получения информации о текущем модераторе
 */
export const useCurrentModerator = () => {
  return useQuery({
    queryKey: moderatorsKeys.current(),
    queryFn: () => moderatorsService.getCurrentModerator(),
    staleTime: Infinity, // Данные модератора не меняются часто
  });
};

