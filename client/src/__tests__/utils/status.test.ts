import { describe, it, expect } from 'vitest';
import {
  getStatusColor,
  getStatusText,
  getPriorityColor,
  getPriorityText,
} from '../../utils/status';
import type { AdStatus, AdPriority } from '../../types';

describe('Status Utils', () => {
  describe('getStatusColor', () => {
    it('должен возвращать правильные цвета для всех статусов', () => {
      expect(getStatusColor('pending' as AdStatus)).toBe('#FFA500');
      expect(getStatusColor('approved' as AdStatus)).toBe('#4CAF50');
      expect(getStatusColor('rejected' as AdStatus)).toBe('#F44336');
      expect(getStatusColor('draft' as AdStatus)).toBe('#9E9E9E');
    });

    it('цвета должны быть в формате HEX', () => {
      const statuses: AdStatus[] = ['pending', 'approved', 'rejected', 'draft'];
      statuses.forEach((status) => {
        const color = getStatusColor(status);
        expect(color).toMatch(/^#[0-9A-F]{6}$/i);
      });
    });
  });

  describe('getStatusText', () => {
    it('должен возвращать русский текст для статусов', () => {
      expect(getStatusText('pending' as AdStatus)).toBe('На модерации');
      expect(getStatusText('approved' as AdStatus)).toBe('Одобрено');
      expect(getStatusText('rejected' as AdStatus)).toBe('Отклонено');
      expect(getStatusText('draft' as AdStatus)).toBe('Черновик');
    });

    it('текст должен быть непустым', () => {
      const statuses: AdStatus[] = ['pending', 'approved', 'rejected', 'draft'];
      statuses.forEach((status) => {
        const text = getStatusText(status);
        expect(text).toBeTruthy();
        expect(text.length).toBeGreaterThan(0);
      });
    });
  });

  describe('getPriorityColor', () => {
    it('должен возвращать правильные цвета для приоритетов', () => {
      expect(getPriorityColor('normal' as AdPriority)).toBe('#2196F3');
      expect(getPriorityColor('urgent' as AdPriority)).toBe('#FF5722');
    });

    it('цвета должны быть в формате HEX', () => {
      const priorities: AdPriority[] = ['normal', 'urgent'];
      priorities.forEach((priority) => {
        const color = getPriorityColor(priority);
        expect(color).toMatch(/^#[0-9A-F]{6}$/i);
      });
    });
  });

  describe('getPriorityText', () => {
    it('должен возвращать русский текст для приоритетов', () => {
      expect(getPriorityText('normal' as AdPriority)).toBe('Обычный');
      expect(getPriorityText('urgent' as AdPriority)).toBe('Срочный');
    });

    it('текст должен быть непустым', () => {
      const priorities: AdPriority[] = ['normal', 'urgent'];
      priorities.forEach((priority) => {
        const text = getPriorityText(priority);
        expect(text).toBeTruthy();
        expect(text.length).toBeGreaterThan(0);
      });
    });
  });
});

