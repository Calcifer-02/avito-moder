import type { Advertisement, Moderator, StatsSummary } from '@/types';

export const mockAdvertisement: Advertisement = {
  id: 1,
  title: 'iPhone 15 Pro Max 256GB',
  description: 'Отличное состояние, все аксессуары в комплекте',
  price: 120000,
  category: 'Электроника',
  categoryId: 0,
  status: 'pending',
  priority: 'normal',
  images: [
    'https://via.placeholder.com/800x600/667eea/ffffff?text=Image+1',
    'https://via.placeholder.com/800x600/764ba2/ffffff?text=Image+2',
    'https://via.placeholder.com/800x600/f093fb/ffffff?text=Image+3',
  ],
  seller: {
    id: 1,
    name: 'Иван Иванов',
    rating: '4.8',
    totalAds: 25,
    registeredAt: '2023-01-15T10:00:00Z',
  },
  characteristics: {
    'Состояние': 'Отличное',
    'Гарантия': 'Есть',
    'Память': '256GB',
    'Цвет': 'Титановый',
  },
  createdAt: '2024-03-15T10:30:00Z',
  updatedAt: '2024-03-15T10:30:00Z',
  moderationHistory: [
    {
      id: 1,
      moderatorId: 1,
      moderatorName: 'Алексей Петров',
      action: 'approved',
      timestamp: '2024-03-15T11:00:00Z',
      reason: null,
      comment: 'Проверено',
    },
  ],
};

export const mockAdvertisements: Advertisement[] = [
  mockAdvertisement,
  {
    ...mockAdvertisement,
    id: 2,
    title: 'MacBook Pro 16" 2023',
    price: 250000,
    status: 'approved',
    priority: 'urgent',
  },
  {
    ...mockAdvertisement,
    id: 3,
    title: 'AirPods Pro 2',
    price: 25000,
    status: 'rejected',
    priority: 'normal',
  },
];

export const mockModerator: Moderator = {
  id: 1,
  name: 'Алексей Петров',
  email: 'alexey.petrov@moderator.avito',
  role: 'Senior Moderator',
  statistics: {
    totalReviewed: 1247,
    todayReviewed: 45,
    thisWeekReviewed: 234,
    thisMonthReviewed: 892,
    averageReviewTime: 156,
    approvalRate: 78.5,
  },
  permissions: ['approve_ads', 'reject_ads', 'request_changes', 'view_stats'],
};

export const mockStatsSummary: StatsSummary = {
  totalReviewed: 1247,
  totalReviewedToday: 45,
  totalReviewedThisWeek: 234,
  totalReviewedThisMonth: 892,
  approvedPercentage: 78.5,
  rejectedPercentage: 15.3,
  requestChangesPercentage: 6.2,
  averageReviewTime: 156,
};

export const mockAdsListResponse = {
  ads: mockAdvertisements,
  pagination: {
    currentPage: 1,
    totalPages: 10,
    totalItems: 100,
    itemsPerPage: 10,
  },
};

