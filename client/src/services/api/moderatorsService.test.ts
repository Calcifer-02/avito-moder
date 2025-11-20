import { describe, it, expect, vi, beforeEach } from 'vitest';
import { moderatorsService } from './moderatorsService';
import apiClient from './client';

// Мокаем apiClient
vi.mock('./client');

describe('moderatorsService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('getCurrentModerator', () => {
    it('должен получать информацию о текущем модераторе', async () => {
      const mockModerator = {
        id: 1,
        name: 'Алексей Петров',
        email: 'alexey@example.com',
        role: 'moderator',
      };
      (apiClient.get as any).mockResolvedValue({ data: mockModerator });

      const result = await moderatorsService.getCurrentModerator();

      expect(apiClient.get).toHaveBeenCalledWith('/moderators/me');
      expect(result).toEqual(mockModerator);
    });

    it('должен обрабатывать ошибку 401 (неавторизован)', async () => {
      const error = new Error('Unauthorized');
      (apiClient.get as any).mockRejectedValue(error);

      await expect(moderatorsService.getCurrentModerator()).rejects.toThrow('Unauthorized');
    });

    it('должен обрабатывать сетевые ошибки', async () => {
      const error = new Error('Network Error');
      (apiClient.get as any).mockRejectedValue(error);

      await expect(moderatorsService.getCurrentModerator()).rejects.toThrow('Network Error');
    });
  });
});

