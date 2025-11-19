/**
 * Константы приложения на основе API спецификации
 */

// Категории объявлений
export const CATEGORIES = [
  { id: 0, name: 'Электроника' },
  { id: 1, name: 'Недвижимость' },
  { id: 2, name: 'Транспорт' },
  { id: 3, name: 'Работа' },
  { id: 4, name: 'Услуги' },
  { id: 5, name: 'Животные' },
  { id: 6, name: 'Мода' },
  { id: 7, name: 'Детское' },
] as const;

// Статусы объявлений
export const AD_STATUSES = {
  PENDING: 'pending' as const,
  APPROVED: 'approved' as const,
  REJECTED: 'rejected' as const,
  DRAFT: 'draft' as const,
};

// Приоритеты
export const AD_PRIORITIES = {
  NORMAL: 'normal' as const,
  URGENT: 'urgent' as const,
};

// Причины отклонения/запроса изменений
export const REJECTION_REASONS = [
  'Запрещенный товар',
  'Неверная категория',
  'Некорректное описание',
  'Проблемы с фото',
  'Подозрение на мошенничество',
  'Другое',
] as const;

// Периоды для статистики
export const STATS_PERIODS = {
  TODAY: 'today' as const,
  WEEK: 'week' as const,
  MONTH: 'month' as const,
  CUSTOM: 'custom' as const,
};

// Поля для сортировки
export const SORT_FIELDS = {
  CREATED_AT: 'createdAt' as const,
  PRICE: 'price' as const,
  PRIORITY: 'priority' as const,
};

// Порядок сортировки
export const SORT_ORDERS = {
  ASC: 'asc' as const,
  DESC: 'desc' as const,
};

// Пагинация
export const DEFAULT_PAGE_SIZE = 10;
export const MAX_PAGE_SIZE = 100;

// API
export const API_BASE_URL = '/api/v1';

