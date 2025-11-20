import { describe, it, expect, vi, beforeEach } from 'vitest';
import { statsService } from './statsService';
import apiClient from './client';
import type { StatsFilters } from '@/types';

// Мокаем apiClient
vi.mock('./client');

describe('statsService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('getSummary', () => {
    it('должен получать статистику без фильтров', async () => {
      const mockSummary = {
        totalReviewed: 100,
        totalReviewedToday: 10,
        approvedPercentage: 60,
        rejectedPercentage: 30,
        requestChangesPercentage: 10,
        averageReviewTime: 120,
        totalReviewedThisWeek: 50,
      };
      (apiClient.get as any).mockResolvedValue({ data: mockSummary });

      const result = await statsService.getSummary();

      expect(apiClient.get).toHaveBeenCalledWith('/stats/summary?');
      expect(result).toEqual(mockSummary);
    });

    it('должен формировать URL с фильтрами периода', async () => {
      const mockSummary = { totalReviewed: 100 };
      (apiClient.get as any).mockResolvedValue({ data: mockSummary });

      const filters: StatsFilters = {
        period: 'week',
      };

      await statsService.getSummary(filters);

      const callArg = (apiClient.get as any).mock.calls[0][0];
      expect(callArg).toContain('period=week');
    });

    it('должен обрабатывать фильтры с датами', async () => {
      const mockSummary = { totalReviewed: 100 };
      (apiClient.get as any).mockResolvedValue({ data: mockSummary });

      const filters: StatsFilters = {
        startDate: '2024-01-01',
        endDate: '2024-01-31',
      };

      await statsService.getSummary(filters);

      const callArg = (apiClient.get as any).mock.calls[0][0];
      expect(callArg).toContain('startDate=2024-01-01');
      expect(callArg).toContain('endDate=2024-01-31');
    });

    it('должен пропускать undefined и null значения', async () => {
      const mockSummary = { totalReviewed: 100 };
      (apiClient.get as any).mockResolvedValue({ data: mockSummary });

      const filters = {
        period: 'today',
        startDate: undefined,
        endDate: null,
      } as any;

      await statsService.getSummary(filters);

      const callArg = (apiClient.get as any).mock.calls[0][0];
      expect(callArg).toContain('period=today');
      expect(callArg).not.toContain('startDate');
      expect(callArg).not.toContain('endDate=null');
    });

    it('должен обрабатывать ошибки API', async () => {
      const error = new Error('Server error');
      (apiClient.get as any).mockRejectedValue(error);

      await expect(statsService.getSummary()).rejects.toThrow('Server error');
    });
  });

  describe('getActivityChart', () => {
    it('должен получать данные графика активности без фильтров', async () => {
      const mockActivity = [
        { date: '2024-01-01', approved: 10, rejected: 5, requestChanges: 2 },
        { date: '2024-01-02', approved: 15, rejected: 3, requestChanges: 1 },
      ];
      (apiClient.get as any).mockResolvedValue({ data: mockActivity });

      const result = await statsService.getActivityChart();

      expect(apiClient.get).toHaveBeenCalledWith('/stats/chart/activity?');
      expect(result).toEqual(mockActivity);
    });

    it('должен формировать URL с фильтрами', async () => {
      const mockActivity: any[] = [];
      (apiClient.get as any).mockResolvedValue({ data: mockActivity });

      const filters: StatsFilters = {
        period: 'month',
        startDate: '2024-01-01',
        endDate: '2024-01-31',
      };

      await statsService.getActivityChart(filters);

      const callArg = (apiClient.get as any).mock.calls[0][0];
      expect(callArg).toContain('period=month');
      expect(callArg).toContain('startDate=2024-01-01');
      expect(callArg).toContain('endDate=2024-01-31');
    });

    it('должен возвращать пустой массив если нет данных', async () => {
      (apiClient.get as any).mockResolvedValue({ data: [] });

      const result = await statsService.getActivityChart();

      expect(result).toEqual([]);
    });

    it('должен обрабатывать ошибки API', async () => {
      const error = new Error('Network error');
      (apiClient.get as any).mockRejectedValue(error);

      await expect(statsService.getActivityChart()).rejects.toThrow('Network error');
    });
  });

  describe('getDecisionsChart', () => {
    it('должен получать данные круговой диаграммы без фильтров', async () => {
      const mockDecisions = {
        approved: 60.5,
        rejected: 25.3,
        requestChanges: 14.2,
      };
      (apiClient.get as any).mockResolvedValue({ data: mockDecisions });

      const result = await statsService.getDecisionsChart();

      expect(apiClient.get).toHaveBeenCalledWith('/stats/chart/decisions?');
      expect(result).toEqual(mockDecisions);
    });

    it('должен формировать URL с фильтрами периода', async () => {
      const mockDecisions = { approved: 50, rejected: 30, requestChanges: 20 };
      (apiClient.get as any).mockResolvedValue({ data: mockDecisions });

      const filters: StatsFilters = {
        period: 'week',
      };

      await statsService.getDecisionsChart(filters);

      const callArg = (apiClient.get as any).mock.calls[0][0];
      expect(callArg).toContain('period=week');
    });

    it('должен обрабатывать данные с нулевыми процентами', async () => {
      const mockDecisions = { approved: 100, rejected: 0, requestChanges: 0 };
      (apiClient.get as any).mockResolvedValue({ data: mockDecisions });

      const result = await statsService.getDecisionsChart();

      expect(result.approved).toBe(100);
      expect(result.rejected).toBe(0);
      expect(result.requestChanges).toBe(0);
    });

    it('должен обрабатывать ошибки API', async () => {
      const error = new Error('Failed to fetch');
      (apiClient.get as any).mockRejectedValue(error);

      await expect(statsService.getDecisionsChart()).rejects.toThrow('Failed to fetch');
    });
  });

  describe('getCategoriesChart', () => {
    it('должен получать данные графика категорий без фильтров', async () => {
      const mockCategories = {
        'Электроника': 150,
        'Недвижимость': 120,
        'Автомобили': 100,
      };
      (apiClient.get as any).mockResolvedValue({ data: mockCategories });

      const result = await statsService.getCategoriesChart();

      expect(apiClient.get).toHaveBeenCalledWith('/stats/chart/categories?');
      expect(result).toEqual(mockCategories);
    });

    it('должен формировать URL с фильтрами', async () => {
      const mockCategories = {};
      (apiClient.get as any).mockResolvedValue({ data: mockCategories });

      const filters: StatsFilters = {
        period: 'today',
        startDate: '2024-01-01',
      };

      await statsService.getCategoriesChart(filters);

      const callArg = (apiClient.get as any).mock.calls[0][0];
      expect(callArg).toContain('period=today');
      expect(callArg).toContain('startDate=2024-01-01');
    });

    it('должен возвращать пустой объект если нет категорий', async () => {
      (apiClient.get as any).mockResolvedValue({ data: {} });

      const result = await statsService.getCategoriesChart();

      expect(result).toEqual({});
    });

    it('должен обрабатывать категории с нулевыми значениями', async () => {
      const mockCategories = { 'Категория 1': 0, 'Категория 2': 5 };
      (apiClient.get as any).mockResolvedValue({ data: mockCategories });

      const result = await statsService.getCategoriesChart();

      expect(result['Категория 1']).toBe(0);
      expect(result['Категория 2']).toBe(5);
    });

    it('должен обрабатывать ошибки API', async () => {
      const error = new Error('Timeout');
      (apiClient.get as any).mockRejectedValue(error);

      await expect(statsService.getCategoriesChart()).rejects.toThrow('Timeout');
    });
  });

  describe('Общие тесты для всех методов', () => {
    it('все методы должны пропускать undefined фильтры', async () => {
      (apiClient.get as any).mockResolvedValue({ data: {} });

      const filters = { period: undefined, startDate: undefined } as any;

      await statsService.getSummary(filters);
      await statsService.getActivityChart(filters);
      await statsService.getDecisionsChart(filters);
      await statsService.getCategoriesChart(filters);

      // Проверяем что все вызовы не содержат undefined параметров
      (apiClient.get as any).mock.calls.forEach((call: any[]) => {
        expect(call[0]).not.toContain('undefined');
      });
    });

    it('все методы должны корректно работать с произвольным периодом', async () => {
      (apiClient.get as any).mockResolvedValue({ data: {} });

      const filters: StatsFilters = {
        period: 'custom',
        startDate: '2024-01-01',
        endDate: '2024-12-31',
      };

      await statsService.getSummary(filters);
      await statsService.getActivityChart(filters);
      await statsService.getDecisionsChart(filters);
      await statsService.getCategoriesChart(filters);

      (apiClient.get as any).mock.calls.forEach((call: any[]) => {
        expect(call[0]).toContain('period=custom');
        expect(call[0]).toContain('startDate=2024-01-01');
        expect(call[0]).toContain('endDate=2024-12-31');
      });
    });
  });
});

