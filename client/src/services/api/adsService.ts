import apiClient from './client';
import type {
  Advertisement,
  AdsListResponse,
  AdsFilters,
  RejectAdRequest,
  RequestChangesRequest,
} from '@/types';

/**
 * Сервис для работы с объявлениями
 */
export const adsService = {
  /**
   * Получить список объявлений с фильтрацией и пагинацией
   */
  getAds: async (filters?: AdsFilters): Promise<AdsListResponse> => {
    const params = new URLSearchParams();

    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          if (Array.isArray(value)) {
            // Для массивов (например, status)
            value.forEach((v) => params.append(key, String(v)));
          } else {
            params.append(key, String(value));
          }
        }
      });
    }

    const response = await apiClient.get<AdsListResponse>(`/ads?${params.toString()}`);
    return response.data;
  },

  /**
   * Получить объявление по ID
   */
  getAdById: async (id: number): Promise<Advertisement> => {
    const response = await apiClient.get<Advertisement>(`/ads/${id}`);
    return response.data;
  },

  /**
   * Одобрить объявление
   */
  approveAd: async (id: number): Promise<{ message: string; ad: Advertisement }> => {
    const response = await apiClient.post(`/ads/${id}/approve`);
    return response.data;
  },

  /**
   * Отклонить объявление
   */
  rejectAd: async (
    id: number,
    data: RejectAdRequest
  ): Promise<{ message: string; ad: Advertisement }> => {
    const response = await apiClient.post(`/ads/${id}/reject`, data);
    return response.data;
  },

  /**
   * Запросить изменения в объявлении
   */
  requestChanges: async (
    id: number,
    data: RequestChangesRequest
  ): Promise<{ message: string; ad: Advertisement }> => {
    const response = await apiClient.post(`/ads/${id}/request-changes`, data);
    return response.data;
  },

  /**
   * Массовое одобрение объявлений
   */
  bulkApprove: async (ids: number[]): Promise<{ success: number; failed: number; results: any[] }> => {
    const results = await Promise.allSettled(
      ids.map(id => adsService.approveAd(id))
    );

    const success = results.filter(r => r.status === 'fulfilled').length;
    const failed = results.filter(r => r.status === 'rejected').length;

    return { success, failed, results };
  },

  /**
   * Массовое отклонение объявлений
   */
  bulkReject: async (
    ids: number[],
    data: RejectAdRequest
  ): Promise<{ success: number; failed: number; results: any[] }> => {
    const results = await Promise.allSettled(
      ids.map(id => adsService.rejectAd(id, data))
    );

    const success = results.filter(r => r.status === 'fulfilled').length;
    const failed = results.filter(r => r.status === 'rejected').length;

    return { success, failed, results };
  },
};

