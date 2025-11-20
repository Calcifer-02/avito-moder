import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { SellerCard } from './SellerCard';

describe('SellerCard', () => {
  const mockSeller = {
    name: 'Иван Иванов',
    rating: '4.8',
    totalAds: 25,
    registeredAt: '2023-01-15T10:00:00Z',
  };

  it('должен рендерить заголовок', () => {
    render(<SellerCard seller={mockSeller} />);
    expect(screen.getByText('Продавец')).toBeInTheDocument();
  });

  it('должен отображать имя продавца', () => {
    render(<SellerCard seller={mockSeller} />);
    expect(screen.getByText(mockSeller.name)).toBeInTheDocument();
  });

  it('должен отображать рейтинг', () => {
    render(<SellerCard seller={mockSeller} />);
    expect(screen.getByText(mockSeller.rating)).toBeInTheDocument();
  });

  it('должен отображать иконку звезды для рейтинга', () => {
    const { container } = render(<SellerCard seller={mockSeller} />);
    const starIcon = container.querySelector('svg[style*="color: rgb(255, 165, 0)"]');
    expect(starIcon).toBeInTheDocument();
  });

  it('должен отображать количество объявлений', () => {
    render(<SellerCard seller={mockSeller} />);
    expect(screen.getByText('Объявлений:')).toBeInTheDocument();
    expect(screen.getByText(mockSeller.totalAds.toString())).toBeInTheDocument();
  });

  it('должен отображать дату регистрации', () => {
    render(<SellerCard seller={mockSeller} />);
    expect(screen.getByText('На платформе:')).toBeInTheDocument();
    // Дата должна быть отформатирована
    expect(screen.getByText(/\d{2}\.\d{2}\.\d{4}/)).toBeInTheDocument();
  });

  it('должен отображать аватар', () => {
    const { container } = render(<SellerCard seller={mockSeller} />);
    // Проверяем наличие иконки Person
    const avatarIcon = container.querySelector('svg');
    expect(avatarIcon).toBeInTheDocument();
  });

  it('должен обрабатывать высокий рейтинг', () => {
    const highRatedSeller = { ...mockSeller, rating: '5.0' };
    render(<SellerCard seller={highRatedSeller} />);
    expect(screen.getByText('5.0')).toBeInTheDocument();
  });

  it('должен обрабатывать низкий рейтинг', () => {
    const lowRatedSeller = { ...mockSeller, rating: '2.5' };
    render(<SellerCard seller={lowRatedSeller} />);
    expect(screen.getByText('2.5')).toBeInTheDocument();
  });

  it('должен обрабатывать большое количество объявлений', () => {
    const manySeller = { ...mockSeller, totalAds: 1500 };
    render(<SellerCard seller={manySeller} />);
    expect(screen.getByText('1500')).toBeInTheDocument();
  });

  it('должен обрабатывать продавца без объявлений', () => {
    const newSeller = { ...mockSeller, totalAds: 0 };
    render(<SellerCard seller={newSeller} />);
    expect(screen.getByText('0')).toBeInTheDocument();
  });

  it('должен корректно форматировать недавнюю дату регистрации', () => {
    const recentSeller = {
      ...mockSeller,
      registeredAt: '2024-11-01T10:00:00Z',
    };
    render(<SellerCard seller={recentSeller} />);
    expect(screen.getByText(/2024/)).toBeInTheDocument();
  });

  it('должен корректно форматировать старую дату регистрации', () => {
    const oldSeller = {
      ...mockSeller,
      registeredAt: '2020-01-01T10:00:00Z',
    };
    render(<SellerCard seller={oldSeller} />);
    expect(screen.getByText(/2020/)).toBeInTheDocument();
  });

  it('должен иметь правильную структуру DOM', () => {
    render(<SellerCard seller={mockSeller} />);

    // CSS modules генерируют хешированные имена, проверяем наличие ключевых элементов
    expect(screen.getByText('Продавец')).toBeInTheDocument();
    expect(screen.getByText(mockSeller.name)).toBeInTheDocument();
    expect(screen.getByText('Объявлений:')).toBeInTheDocument();
    expect(screen.getByText('На платформе:')).toBeInTheDocument();
  });
});

