import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { adsService } from '@services/api';
import type {
  AdsFilters,
  RejectAdRequest,
  RequestChangesRequest,
} from '@/types';

/**
 * Ключи для кеширования запросов объявлений
 */
export const adsKeys = {
  all: ['ads'] as const,
  lists: () => [...adsKeys.all, 'list'] as const,
  list: (filters: AdsFilters) => [...adsKeys.lists(), filters] as const,
  details: () => [...adsKeys.all, 'detail'] as const,
  detail: (id: number) => [...adsKeys.details(), id] as const,
};

/**
 * Хук для получения списка объявлений
 */
export const useAds = (filters?: AdsFilters) => {
  return useQuery({
    queryKey: adsKeys.list(filters || {}),
    queryFn: () => adsService.getAds(filters),
    staleTime: 30000, // 30 секунд
  });
};

/**
 * Хук для получения объявления по ID
 */
export const useAd = (id: number) => {
  return useQuery({
    queryKey: adsKeys.detail(id),
    queryFn: () => adsService.getAdById(id),
    enabled: !!id,
  });
};

/**
 * Хук для одобрения объявления
 */
export const useApproveAd = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => adsService.approveAd(id),
    onSuccess: (data) => {
      // Инвалидируем кеш списка объявлений
      queryClient.invalidateQueries({ queryKey: adsKeys.lists() });
      // Обновляем кеш конкретного объявления
      queryClient.setQueryData(adsKeys.detail(data.ad.id), data.ad);
      // Инвалидируем статистику для немедленного обновления
      queryClient.invalidateQueries({ queryKey: ['stats'] });
    },
  });
};

/**
 * Хук для отклонения объявления
 */
export const useRejectAd = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: RejectAdRequest }) =>
      adsService.rejectAd(id, data),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: adsKeys.lists() });
      queryClient.setQueryData(adsKeys.detail(data.ad.id), data.ad);
      // Инвалидируем статистику для немедленного обновления
      queryClient.invalidateQueries({ queryKey: ['stats'] });
    },
  });
};

/**
 * Хук для запроса изменений в объявлении
 */
export const useRequestChanges = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: RequestChangesRequest }) =>
      adsService.requestChanges(id, data),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: adsKeys.lists() });
      queryClient.setQueryData(adsKeys.detail(data.ad.id), data.ad);
      // Инвалидируем статистику для немедленного обновления
      queryClient.invalidateQueries({ queryKey: ['stats'] });
    },
  });
};

