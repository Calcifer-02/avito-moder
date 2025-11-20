import { describe, it, expect, vi, beforeEach } from 'vitest';
import { adsService } from './adsService';
import apiClient from './client';
import type { AdsFilters, RejectAdRequest, RequestChangesRequest } from '@/types';

// Мокаем apiClient
vi.mock('./client');

describe('adsService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('getAds', () => {
    it('должен вызывать API без параметров если фильтры не переданы', async () => {
      const mockResponse = { data: [], total: 0 };
      (apiClient.get as any).mockResolvedValue({ data: mockResponse });

      const result = await adsService.getAds();

      expect(apiClient.get).toHaveBeenCalledWith('/ads?');
      expect(result).toEqual(mockResponse);
    });

    it('должен формировать правильные URL параметры с фильтрами', async () => {
      const mockResponse = { data: [], total: 0 };
      (apiClient.get as any).mockResolvedValue({ data: mockResponse });

      const filters: AdsFilters = {
        page: 1,
        limit: 10,
        status: ['pending'],
        sortBy: 'createdAt',
        sortOrder: 'desc',
      };

      await adsService.getAds(filters);

      expect(apiClient.get).toHaveBeenCalledWith(
        expect.stringContaining('/ads?')
      );
      const callArg = (apiClient.get as any).mock.calls[0][0];
      expect(callArg).toContain('page=1');
      expect(callArg).toContain('limit=10');
      expect(callArg).toContain('status=pending');
      expect(callArg).toContain('sortBy=createdAt');
      expect(callArg).toContain('sortOrder=desc');
    });

    it('должен обрабатывать массивы в фильтрах (multiple status)', async () => {
      const mockResponse = { data: [], total: 0 };
      (apiClient.get as any).mockResolvedValue({ data: mockResponse });

      const filters: AdsFilters = {
        status: ['pending', 'approved'],
      };

      await adsService.getAds(filters);

      const callArg = (apiClient.get as any).mock.calls[0][0];
      expect(callArg).toContain('status=pending');
      expect(callArg).toContain('status=approved');
    });

    it('должен пропускать undefined и null значения', async () => {
      const mockResponse = { data: [], total: 0 };
      (apiClient.get as any).mockResolvedValue({ data: mockResponse });

      const filters = {
        page: 1,
        search: undefined,
        category: null,
      } as any;

      await adsService.getAds(filters);

      const callArg = (apiClient.get as any).mock.calls[0][0];
      expect(callArg).toContain('page=1');
      expect(callArg).not.toContain('search');
      expect(callArg).not.toContain('category=null');
    });

    it('должен обрабатывать диапазон цен', async () => {
      const mockResponse = { data: [], total: 0 };
      (apiClient.get as any).mockResolvedValue({ data: mockResponse });

      const filters: AdsFilters = {
        minPrice: 1000,
        maxPrice: 5000,
      };

      await adsService.getAds(filters);

      const callArg = (apiClient.get as any).mock.calls[0][0];
      expect(callArg).toContain('minPrice=1000');
      expect(callArg).toContain('maxPrice=5000');
    });

    it('должен обрабатывать ошибки API', async () => {
      const error = new Error('Network error');
      (apiClient.get as any).mockRejectedValue(error);

      await expect(adsService.getAds()).rejects.toThrow('Network error');
    });
  });

  describe('getAdById', () => {
    it('должен получать объявление по ID', async () => {
      const mockAd = { id: 1, title: 'Test Ad', status: 'pending' };
      (apiClient.get as any).mockResolvedValue({ data: mockAd });

      const result = await adsService.getAdById(1);

      expect(apiClient.get).toHaveBeenCalledWith('/ads/1');
      expect(result).toEqual(mockAd);
    });

    it('должен обрабатывать ошибку 404', async () => {
      const error = new Error('Not found');
      (apiClient.get as any).mockRejectedValue(error);

      await expect(adsService.getAdById(999)).rejects.toThrow('Not found');
    });
  });

  describe('approveAd', () => {
    it('должен одобрить объявление', async () => {
      const mockResponse = { message: 'Success', ad: { id: 1, status: 'approved' } };
      (apiClient.post as any).mockResolvedValue({ data: mockResponse });

      const result = await adsService.approveAd(1);

      expect(apiClient.post).toHaveBeenCalledWith('/ads/1/approve');
      expect(result).toEqual(mockResponse);
    });

    it('должен обрабатывать ошибки при одобрении', async () => {
      const error = new Error('Already approved');
      (apiClient.post as any).mockRejectedValue(error);

      await expect(adsService.approveAd(1)).rejects.toThrow('Already approved');
    });
  });

  describe('rejectAd', () => {
    it('должен отклонить объявление с причиной', async () => {
      const mockResponse = { message: 'Success', ad: { id: 1, status: 'rejected' } };
      (apiClient.post as any).mockResolvedValue({ data: mockResponse });

      const rejectData: RejectAdRequest = {
        reason: 'Запрещенный товар',
        comment: 'This is spam',
      };

      const result = await adsService.rejectAd(1, rejectData);

      expect(apiClient.post).toHaveBeenCalledWith('/ads/1/reject', rejectData);
      expect(result).toEqual(mockResponse);
    });

    it('должен отклонить без комментария', async () => {
      const mockResponse = { message: 'Success', ad: { id: 1, status: 'rejected' } };
      (apiClient.post as any).mockResolvedValue({ data: mockResponse });

      const rejectData: RejectAdRequest = {
        reason: 'Некорректное описание',
      };

      const result = await adsService.rejectAd(1, rejectData);

      expect(apiClient.post).toHaveBeenCalledWith('/ads/1/reject', rejectData);
      expect(result).toEqual(mockResponse);
    });
  });

  describe('requestChanges', () => {
    it('должен запросить изменения в объявлении', async () => {
      const mockResponse = { message: 'Success', ad: { id: 1, status: 'draft' } };
      (apiClient.post as any).mockResolvedValue({ data: mockResponse });

      const requestData: RequestChangesRequest = {
        reason: 'Неверная категория',
        comment: 'Please fix category',
      };

      const result = await adsService.requestChanges(1, requestData);

      expect(apiClient.post).toHaveBeenCalledWith('/ads/1/request-changes', requestData);
      expect(result).toEqual(mockResponse);
    });
  });

  describe('bulkApprove', () => {
    it('должен массово одобрить несколько объявлений', async () => {
      const mockResponse = { message: 'Success', ad: { status: 'approved' } };
      (apiClient.post as any).mockResolvedValue({ data: mockResponse });

      const result = await adsService.bulkApprove([1, 2, 3]);

      expect(apiClient.post).toHaveBeenCalledTimes(3);
      expect(apiClient.post).toHaveBeenCalledWith('/ads/1/approve');
      expect(apiClient.post).toHaveBeenCalledWith('/ads/2/approve');
      expect(apiClient.post).toHaveBeenCalledWith('/ads/3/approve');
      expect(result.success).toBe(3);
      expect(result.failed).toBe(0);
    });

    it('должен правильно считать успешные и неудачные операции', async () => {
      (apiClient.post as any)
        .mockResolvedValueOnce({ data: { message: 'Success' } }) // ID 1 - success
        .mockRejectedValueOnce(new Error('Failed')) // ID 2 - failed
        .mockResolvedValueOnce({ data: { message: 'Success' } }); // ID 3 - success

      const result = await adsService.bulkApprove([1, 2, 3]);

      expect(result.success).toBe(2);
      expect(result.failed).toBe(1);
      expect(result.results).toHaveLength(3);
    });

    it('должен работать с пустым массивом', async () => {
      const result = await adsService.bulkApprove([]);

      expect(apiClient.post).not.toHaveBeenCalled();
      expect(result.success).toBe(0);
      expect(result.failed).toBe(0);
      expect(result.results).toHaveLength(0);
    });

    it('должен обрабатывать случай когда все операции неудачны', async () => {
      (apiClient.post as any).mockRejectedValue(new Error('Failed'));

      const result = await adsService.bulkApprove([1, 2]);

      expect(result.success).toBe(0);
      expect(result.failed).toBe(2);
    });
  });

  describe('bulkReject', () => {
    it('должен массово отклонить несколько объявлений', async () => {
      const mockResponse = { message: 'Success', ad: { status: 'rejected' } };
      (apiClient.post as any).mockResolvedValue({ data: mockResponse });

      const rejectData: RejectAdRequest = {
        reason: 'Запрещенный товар',
        comment: 'This is spam',
      };

      const result = await adsService.bulkReject([1, 2, 3], rejectData);

      expect(apiClient.post).toHaveBeenCalledTimes(3);
      expect(apiClient.post).toHaveBeenCalledWith('/ads/1/reject', rejectData);
      expect(apiClient.post).toHaveBeenCalledWith('/ads/2/reject', rejectData);
      expect(apiClient.post).toHaveBeenCalledWith('/ads/3/reject', rejectData);
      expect(result.success).toBe(3);
      expect(result.failed).toBe(0);
    });

    it('должен правильно считать успешные и неудачные операции', async () => {
      (apiClient.post as any)
        .mockResolvedValueOnce({ data: { message: 'Success' } })
        .mockResolvedValueOnce({ data: { message: 'Success' } })
        .mockRejectedValueOnce(new Error('Failed'));

      const rejectData: RejectAdRequest = { reason: 'Запрещенный товар' };

      const result = await adsService.bulkReject([1, 2, 3], rejectData);

      expect(result.success).toBe(2);
      expect(result.failed).toBe(1);
    });

    it('должен использовать одинаковые данные для всех отклонений', async () => {
      (apiClient.post as any).mockResolvedValue({ data: { message: 'Success' } });

      const rejectData: RejectAdRequest = {
        reason: 'Некорректное описание',
        comment: 'Содержит некорректное содержание',
      };

      await adsService.bulkReject([1, 2], rejectData);

      expect(apiClient.post).toHaveBeenNthCalledWith(1, '/ads/1/reject', rejectData);
      expect(apiClient.post).toHaveBeenNthCalledWith(2, '/ads/2/reject', rejectData);
    });

    it('должен работать с пустым массивом', async () => {
      const rejectData: RejectAdRequest = { reason: 'Запрещенный товар' };
      const result = await adsService.bulkReject([], rejectData);

      expect(apiClient.post).not.toHaveBeenCalled();
      expect(result.success).toBe(0);
      expect(result.failed).toBe(0);
    });
  });
});
