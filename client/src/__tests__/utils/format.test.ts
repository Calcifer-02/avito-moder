import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import {
  pluralize,
  formatDate,
  formatDateTime,
  formatPrice,
  formatRelativeTime,
} from '../../utils/format';

describe('Format Utils', () => {
  describe('pluralize', () => {
    it('должен возвращать форму для единственного числа', () => {
      expect(pluralize(1, 'объявление', 'объявления', 'объявлений')).toBe('объявление');
      expect(pluralize(21, 'объявление', 'объявления', 'объявлений')).toBe('объявление');
      expect(pluralize(101, 'объявление', 'объявления', 'объявлений')).toBe('объявление');
    });

    it('должен возвращать форму для 2-4', () => {
      expect(pluralize(2, 'объявление', 'объявления', 'объявлений')).toBe('объявления');
      expect(pluralize(3, 'объявление', 'объявления', 'объявлений')).toBe('объявления');
      expect(pluralize(4, 'объявление', 'объявления', 'объявлений')).toBe('объявления');
      expect(pluralize(22, 'объявление', 'объявления', 'объявлений')).toBe('объявления');
    });

    it('должен возвращать форму для множественного числа', () => {
      expect(pluralize(0, 'объявление', 'объявления', 'объявлений')).toBe('объявлений');
      expect(pluralize(5, 'объявление', 'объявления', 'объявлений')).toBe('объявлений');
      expect(pluralize(11, 'объявление', 'объявления', 'объявлений')).toBe('объявлений');
      expect(pluralize(100, 'объявление', 'объявления', 'объявлений')).toBe('объявлений');
    });
  });

  describe('formatDate', () => {
    it('должен форматировать дату в формат DD.MM.YYYY', () => {
      const date = '2024-03-15T10:30:00Z';
      const formatted = formatDate(date);
      expect(formatted).toMatch(/\d{2}\.\d{2}\.\d{4}/);
    });

    it('должен обрабатывать разные форматы входных данных', () => {
      expect(formatDate('2024-01-01')).toBeTruthy();
      expect(formatDate('2024-12-31T23:59:59Z')).toBeTruthy();
    });
  });

  describe('formatDateTime', () => {
    it('должен форматировать дату и время', () => {
      const dateTime = '2024-03-15T10:30:00Z';
      const formatted = formatDateTime(dateTime);
      expect(formatted).toMatch(/\d{2}\.\d{2}\.\d{4},?\s+\d{2}:\d{2}/);
    });
  });

  describe('formatPrice', () => {
    it('должен форматировать цену в рублях', () => {
      expect(formatPrice(1000)).toContain('1');
      expect(formatPrice(1000)).toContain('₽');
    });

    it('должен форматировать большие числа с разделителями', () => {
      const formatted = formatPrice(1000000);
      expect(formatted).toContain('₽');
      // Проверяем что есть разделители тысяч
      expect(formatted.replace(/\s/g, '').length).toBeGreaterThan(3);
    });

    it('должен округлять до целых', () => {
      const formatted = formatPrice(1000.99);
      expect(formatted).not.toContain('99');
    });

    it('должен обрабатывать ноль', () => {
      const formatted = formatPrice(0);
      expect(formatted).toContain('0');
      expect(formatted).toContain('₽');
    });
  });

  describe('formatRelativeTime', () => {
    beforeEach(() => {
      // Фиксируем текущее время для предсказуемости тестов
      vi.useFakeTimers();
      vi.setSystemTime(new Date('2024-03-15T12:00:00Z'));
    });

    it('должен возвращать "только что" для недавних дат', () => {
      const justNow = new Date('2024-03-15T11:59:30Z').toISOString();
      expect(formatRelativeTime(justNow)).toBe('только что');
    });

    it('должен форматировать минуты назад', () => {
      const fiveMinutesAgo = new Date('2024-03-15T11:55:00Z').toISOString();
      const result = formatRelativeTime(fiveMinutesAgo);
      expect(result).toContain('минут');
      expect(result).toContain('5');
    });

    it('должен форматировать часы назад', () => {
      const twoHoursAgo = new Date('2024-03-15T10:00:00Z').toISOString();
      const result = formatRelativeTime(twoHoursAgo);
      expect(result).toContain('час');
      expect(result).toContain('2');
    });

    it('должен форматировать дни назад', () => {
      const threeDaysAgo = new Date('2024-03-12T12:00:00Z').toISOString();
      const result = formatRelativeTime(threeDaysAgo);
      expect(result).toContain('дня');
      expect(result).toContain('3');
    });

    it('должен возвращать полную дату для старых записей', () => {
      const weekAgo = new Date('2024-03-08T12:00:00Z').toISOString();
      const result = formatRelativeTime(weekAgo);
      expect(result).toMatch(/\d{2}\.\d{2}\.\d{4}/);
    });

    afterEach(() => {
      vi.useRealTimers();
    });
  });
});

