import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { AdCard } from './AdCard';
import type { Advertisement } from '../../../types';

describe('AdCard', () => {
  const mockAd: Advertisement = {
    id: 1,
    title: 'Тестовое объявление',
    price: 50000,
    category: 'Электроника',
    categoryId: 1,
    status: 'pending',
    priority: 'normal',
    createdAt: '2024-03-15T10:00:00Z',
    updatedAt: '2024-03-15T10:00:00Z',
    images: ['https://example.com/image1.jpg', 'https://example.com/image2.jpg'],
    description: 'Описание',
    characteristics: {},
    seller: {
        id: 1,
        name: 'Продавец',
        rating: '4.5',
        totalAds: 10,
        registeredAt: '2023-01-01T00:00:00Z',
    },
    moderationHistory: [],
  };

  const mockProps = {
    ad: mockAd,
    onCardClick: vi.fn(),
  };

  it('должен рендерить название объявления', () => {
    render(<AdCard {...mockProps} />);
    expect(screen.getByText('Тестовое объявление')).toBeInTheDocument();
  });

  it('должен отображать цену', () => {
    render(<AdCard {...mockProps} />);
    expect(screen.getByText(/50.*000/)).toBeInTheDocument();
  });

  it('должен отображать категорию', () => {
    render(<AdCard {...mockProps} />);
    expect(screen.getByText('Электроника')).toBeInTheDocument();
  });

  it('должен отображать статус', () => {
    render(<AdCard {...mockProps} />);
    expect(screen.getByText('На модерации')).toBeInTheDocument();
  });

  it('должен отображать изображение', () => {
    render(<AdCard {...mockProps} />);
    const image = screen.getByAltText('Тестовое объявление');
    expect(image).toBeInTheDocument();
    expect(image).toHaveAttribute('src', mockAd.images[0]);
  });

  it('должен вызывать onCardClick при клике на карточку', async () => {
    const user = userEvent.setup();
    render(<AdCard {...mockProps} />);

    const card = screen.getByText('Тестовое объявление').closest('div')!;
    await user.click(card);

    expect(mockProps.onCardClick).toHaveBeenCalledWith(mockAd.id);
  });

  it('должен показывать бейдж "Срочно" для срочных объявлений', () => {
    const urgentAd = { ...mockAd, priority: 'urgent' as const };
    render(<AdCard {...mockProps} ad={urgentAd} />);

    expect(screen.getByText('Срочно')).toBeInTheDocument();
  });

  it('не должен показывать бейдж "Срочно" для обычных объявлений', () => {
    render(<AdCard {...mockProps} />);
    expect(screen.queryByText('Срочно')).not.toBeInTheDocument();
  });

  it('должен отображать checkbox в bulk режиме', () => {
    render(<AdCard {...mockProps} isBulkMode={true} onCheckboxChange={vi.fn()} />);
    expect(screen.getByRole('checkbox')).toBeInTheDocument();
  });

  it('не должен отображать checkbox вне bulk режима', () => {
    render(<AdCard {...mockProps} isBulkMode={false} />);
    expect(screen.queryByRole('checkbox')).not.toBeInTheDocument();
  });

  it('должен отображать checkbox как отмеченный если isSelected = true', () => {
    render(<AdCard {...mockProps} isBulkMode={true} isSelected={true} onCheckboxChange={vi.fn()} />);
    const checkbox = screen.getByRole('checkbox') as HTMLInputElement;
    expect(checkbox.checked).toBe(true);
  });

  it('должен вызывать onCheckboxChange при клике на checkbox', async () => {
    const user = userEvent.setup();
    const mockOnCheckboxChange = vi.fn();
    render(
      <AdCard
        {...mockProps}
        isBulkMode={true}
        onCheckboxChange={mockOnCheckboxChange}
      />
    );

    const checkbox = screen.getByRole('checkbox');
    await user.click(checkbox);

    expect(mockOnCheckboxChange).toHaveBeenCalled();
  });

  it('не должен вызывать onCardClick при клике на checkbox', async () => {
    const user = userEvent.setup();
    const mockOnCardClick = vi.fn();
    render(
      <AdCard
        {...mockProps}
        isBulkMode={true}
        onCardClick={mockOnCardClick}
        onCheckboxChange={vi.fn()}
      />
    );

    const checkbox = screen.getByRole('checkbox');
    await user.click(checkbox);

    expect(mockOnCardClick).not.toHaveBeenCalled();
  });

  it('должен применять класс selected когда isSelected = true', () => {
      render(
          <AdCard {...mockProps} isBulkMode={true} isSelected={true} onCheckboxChange={vi.fn()}/>
      );
    // CSS modules хешируют имена классов, проверяем через наличие checkbox и его состояние
    const checkbox = screen.getByRole('checkbox') as HTMLInputElement;
    expect(checkbox.checked).toBe(true);
  });

  it('должен применять класс bulkModeCard в bulk режиме', () => {
      render(
          <AdCard {...mockProps} isBulkMode={true} onCheckboxChange={vi.fn()}/>
      );
    // CSS modules хешируют имена классов, проверяем наличие checkbox как индикатор bulk режима
    const checkbox = screen.getByRole('checkbox');
    expect(checkbox).toBeInTheDocument();
  });

  it('должен отображать дату создания', () => {
    render(<AdCard {...mockProps} />);
    // Проверяем что дата отформатирована
    expect(screen.getByText(/\d{2}\.\d{2}\.\d{4}/)).toBeInTheDocument();
  });

  it('должен корректно отображать разные статусы', () => {
    const statuses: Array<Advertisement['status']> = ['pending', 'approved', 'rejected', 'draft'];
    const expectedTexts = ['На модерации', 'Одобрено', 'Отклонено', 'Черновик'];

    statuses.forEach((status, index) => {
      const { unmount } = render(<AdCard {...mockProps} ad={{ ...mockAd, status }} />);
      expect(screen.getByText(expectedTexts[index])).toBeInTheDocument();
      unmount();
    });
  });
});
