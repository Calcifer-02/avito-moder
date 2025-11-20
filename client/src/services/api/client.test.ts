import { describe, it, expect } from 'vitest';

/**
 * Тесты для apiClient
 *
 * Примечание: apiClient создается как singleton при импорте модуля,
 * что усложняет тестирование. Здесь мы тестируем концепцию и конфигурацию.
 */
describe('apiClient configuration', () => {
  it('должен экспортировать валидный API client', async () => {
    const { default: apiClient } = await import('./client');

    expect(apiClient).toBeDefined();
    expect(apiClient.defaults).toBeDefined();
  });

  it('должен иметь правильный baseURL', async () => {
    const { default: apiClient } = await import('./client');

    expect(apiClient.defaults.baseURL).toBe('/api/v1');
  });

  it('должен иметь timeout 10 секунд', async () => {
    const { default: apiClient } = await import('./client');

    expect(apiClient.defaults.timeout).toBe(10000);
  });

  it('должен иметь Content-Type заголовок application/json', async () => {
    const { default: apiClient } = await import('./client');

    expect(apiClient.defaults.headers['Content-Type']).toBe('application/json');
  });

  it('должен иметь настроенные interceptors', async () => {
    const { default: apiClient } = await import('./client');

    expect(apiClient.interceptors).toBeDefined();
    expect(apiClient.interceptors.response).toBeDefined();
  });

  it('должен иметь методы для HTTP запросов', async () => {
    const { default: apiClient } = await import('./client');

    expect(typeof apiClient.get).toBe('function');
    expect(typeof apiClient.post).toBe('function');
    expect(typeof apiClient.put).toBe('function');
    expect(typeof apiClient.delete).toBe('function');
    expect(typeof apiClient.patch).toBe('function');
  });
});

