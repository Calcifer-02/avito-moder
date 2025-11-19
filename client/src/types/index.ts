// Базовые типы для объявлений и модерации на основе реального API

export type AdStatus = 'pending' | 'approved' | 'rejected' | 'draft';
export type AdPriority = 'normal' | 'urgent';
export type ModerationAction = 'approved' | 'rejected' | 'requestChanges';
export type RejectReason =
  | 'Запрещенный товар'
  | 'Неверная категория'
  | 'Некорректное описание'
  | 'Проблемы с фото'
  | 'Подозрение на мошенничество'
  | 'Другое';

// Категории (из data.js сервера)
export const CATEGORIES = [
  'Электроника',      // categoryId: 0
  'Недвижимость',     // categoryId: 1
  'Транспорт',        // categoryId: 2
  'Работа',           // categoryId: 3
  'Услуги',           // categoryId: 4
  'Животные',         // categoryId: 5
  'Мода',             // categoryId: 6
  'Детское'           // categoryId: 7
] as const;

export type CategoryName = typeof CATEGORIES[number];

export interface Seller {
  id: number;
  name: string;
  rating: string; // В API это строка, например "4.5"
  totalAds: number;
  registeredAt: string;
}

export interface ModerationHistoryItem {
  id: number;
  moderatorId: number;
  moderatorName: string;
  action: ModerationAction;
  timestamp: string;
  reason?: string | null;
  comment?: string;
}

export interface Advertisement {
  id: number;
  title: string;
  description: string;
  price: number;
  category: string;
  categoryId: number;
  status: AdStatus;
  priority: AdPriority;
  images: string[];
  seller: Seller;
  characteristics: Record<string, string>;
  createdAt: string;
  updatedAt: string;
  moderationHistory: ModerationHistoryItem[];
}

export interface Pagination {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
}

export interface AdsListResponse {
  ads: Advertisement[];
  pagination: Pagination;
}

export interface AdsFilters {
  page?: number;
  limit?: number;
  status?: AdStatus[];
  categoryId?: number;
  minPrice?: number;
  maxPrice?: number;
  search?: string;
  sortBy?: 'createdAt' | 'price' | 'priority';
  sortOrder?: 'asc' | 'desc';
}

export interface RejectAdRequest {
  reason: RejectReason;
  comment?: string;
}

export interface RequestChangesRequest {
  reason: RejectReason;
  comment?: string;
}

// Типы для статистики
export type StatsPeriod = 'today' | 'week' | 'month' | 'custom';

export interface StatsSummary {
  totalReviewed: number;
  totalReviewedToday: number;
  totalReviewedThisWeek: number;
  totalReviewedThisMonth: number;
  approvedPercentage: number;
  rejectedPercentage: number;
  requestChangesPercentage: number;
  averageReviewTime: number; // в секундах
}

export interface ActivityData {
  date: string; // формат: YYYY-MM-DD
  approved: number;
  rejected: number;
  requestChanges: number;
}

export interface DecisionsData {
  approved: number;
  rejected: number;
  requestChanges: number;
}

export interface CategoriesData {
  [categoryName: string]: number;
}

export interface StatsFilters {
  period?: StatsPeriod;
  startDate?: string; // формат: YYYY-MM-DD
  endDate?: string;   // формат: YYYY-MM-DD
}

export interface ModeratorStatistics {
  totalReviewed: number;
  todayReviewed: number;
  thisWeekReviewed: number;
  thisMonthReviewed: number;
  averageReviewTime: number;
  approvalRate: number;
}

export interface Moderator {
  id: number;
  name: string;
  email: string;
  role: string;
  statistics: ModeratorStatistics;
  permissions: string[];
}

