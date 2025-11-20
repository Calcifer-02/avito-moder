import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { AdInfo } from './AdInfo';
import type { AdStatus, AdPriority } from '@/types';

describe('AdInfo', () => {
  const mockProps = {
    title: 'iPhone 15 Pro',
    price: 120000,
    status: 'pending' as AdStatus,
    category: 'Электроника',
    priority: 'normal' as AdPriority,
    createdAt: '2024-03-15T10:30:00Z',
    updatedAt: '2024-03-15T12:30:00Z',
    description: 'Отличное состояние, все в комплекте',
    characteristics: {
      'Память': '256GB',
      'Цвет': 'Титановый',
      'Состояние': 'Отличное',
    },
  };

  it('должен рендерить заголовок', () => {
    render(<AdInfo {...mockProps} />);
    expect(screen.getByRole('heading', { name: mockProps.title })).toBeInTheDocument();
  });

  it('должен форматировать и отображать цену', () => {
    render(<AdInfo {...mockProps} />);
    // Цена должна содержать рубли
    expect(screen.getByText(/120/)).toBeInTheDocument();
    expect(screen.getByText(/₽/)).toBeInTheDocument();
  });

  it('должен отображать статус', () => {
    render(<AdInfo {...mockProps} />);
    expect(screen.getByText('На модерации')).toBeInTheDocument();
  });

  it('должен отображать категорию', () => {
    render(<AdInfo {...mockProps} />);
    expect(screen.getByText('Категория:')).toBeInTheDocument();
    expect(screen.getByText(mockProps.category)).toBeInTheDocument();
  });

  it('должен отображать приоритет', () => {
    render(<AdInfo {...mockProps} />);
    expect(screen.getByText('Приоритет:')).toBeInTheDocument();
    expect(screen.getByText('Обычный')).toBeInTheDocument();
  });

  it('должен отображать приоритет "Срочный" для urgent', () => {
    render(<AdInfo {...mockProps} priority="urgent" />);
    expect(screen.getByText('Срочный')).toBeInTheDocument();
  });

  it('должен отображать даты создания и обновления', () => {
    render(<AdInfo {...mockProps} />);
    expect(screen.getByText('Создано:')).toBeInTheDocument();
    expect(screen.getByText('Обновлено:')).toBeInTheDocument();
  });

  it('должен отображать описание', () => {
    render(<AdInfo {...mockProps} />);
    expect(screen.getByText('Описание')).toBeInTheDocument();
    expect(screen.getByText(mockProps.description)).toBeInTheDocument();
  });

  it('должен отображать характеристики в таблице', () => {
    render(<AdInfo {...mockProps} />);
    expect(screen.getByText('Характеристики')).toBeInTheDocument();

    Object.entries(mockProps.characteristics).forEach(([key, value]) => {
      expect(screen.getByText(key)).toBeInTheDocument();
      expect(screen.getByText(value)).toBeInTheDocument();
    });
  });

  it('должен корректно отображать разные статусы', () => {
    const statuses: AdStatus[] = ['pending', 'approved', 'rejected', 'draft'];
    const expectedTexts = ['На модерации', 'Одобрено', 'Отклонено', 'Черновик'];

    statuses.forEach((status, index) => {
      const { unmount } = render(<AdInfo {...mockProps} status={status} />);
      expect(screen.getByText(expectedTexts[index])).toBeInTheDocument();
      unmount();
    });
  });

  it('должен обрабатывать пустые характеристики', () => {
    render(<AdInfo {...mockProps} characteristics={{}} />);
    expect(screen.getByText('Характеристики')).toBeInTheDocument();
  });

  it('должен отображать длинное описание', () => {
    const longDescription = 'Очень длинное описание '.repeat(50);
    render(<AdInfo {...mockProps} description={longDescription} />);
    // Проверяем что текст присутствует (частичное совпадение)
    expect(screen.getByText(/Очень длинное описание/)).toBeInTheDocument();
  });

  it('должен правильно форматировать большие цены', () => {
    render(<AdInfo {...mockProps} price={1500000} />);
    expect(screen.getByText(/1.*500.*000/)).toBeInTheDocument();
  });
});

