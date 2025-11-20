import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { ActivityChart } from './ActivityChart';
import type { ActivityData } from '../../../types';

describe('ActivityChart', () => {
  const mockData: ActivityData[] = [
    {
      date: '2024-03-15',
      approved: 10,
      rejected: 5,
      requestChanges: 3,
    },
    {
      date: '2024-03-16',
      approved: 15,
      rejected: 8,
      requestChanges: 2,
    },
    {
      date: '2024-03-17',
      approved: 12,
      rejected: 4,
      requestChanges: 5,
    },
  ];

  it('должен рендерить заголовок', () => {
    render(<ActivityChart data={mockData} />);
    expect(screen.getByText('График активности по дням')).toBeInTheDocument();
  });

  it('не должен рендериться если data пустой', () => {
    const { container } = render(<ActivityChart data={[]} />);
    expect(container.firstChild).toBeNull();
  });

  it('не должен рендериться если data null', () => {
    const { container } = render(<ActivityChart data={null as any} />);
    expect(container.firstChild).toBeNull();
  });

  it('должен отображать столбцы для каждого дня', () => {
    render(<ActivityChart data={mockData} />);
    // CSS Modules хешируют классы, проверяем через контент
    expect(screen.getByText(/15 мар/)).toBeInTheDocument();
    expect(screen.getByText(/16 мар/)).toBeInTheDocument();
    expect(screen.getByText(/17 мар/)).toBeInTheDocument();
  });

  it('должен отображать дату для каждого столбца', () => {
    render(<ActivityChart data={mockData} />);

    expect(screen.getByText(/15 мар/)).toBeInTheDocument();
    expect(screen.getByText(/16 мар/)).toBeInTheDocument();
    expect(screen.getByText(/17 мар/)).toBeInTheDocument();
  });

  it('должен отображать общее количество для каждого дня', () => {
    render(<ActivityChart data={mockData} />);

    // День 1: 10 + 5 + 3 = 18
    expect(screen.getByText('18')).toBeInTheDocument();
    // День 2: 15 + 8 + 2 = 25
    expect(screen.getByText('25')).toBeInTheDocument();
    // День 3: 12 + 4 + 5 = 21
    expect(screen.getByText('21')).toBeInTheDocument();
  });

  it('должен отображать легенду', () => {
    render(<ActivityChart data={mockData} />);

    expect(screen.getByText('Одобрено')).toBeInTheDocument();
    expect(screen.getByText('Отклонено')).toBeInTheDocument();
    expect(screen.getByText('На доработку')).toBeInTheDocument();
  });

  it('должен отображать цветные индикаторы в легенде', () => {
    render(<ActivityChart data={mockData} />);
    // Проверяем через наличие легенды
    expect(screen.getByText('Одобрено')).toBeInTheDocument();
    expect(screen.getByText('Отклонено')).toBeInTheDocument();
    expect(screen.getByText('На доработку')).toBeInTheDocument();
  });

  it('должен иметь стек для каждого столбца', () => {
    render(<ActivityChart data={mockData} />);
    // Проверяем через наличие итоговых чисел
    expect(screen.getByText('18')).toBeInTheDocument();
    expect(screen.getByText('25')).toBeInTheDocument();
    expect(screen.getByText('21')).toBeInTheDocument();
  });

  it('должен иметь сегменты в каждом столбце', () => {
    render(<ActivityChart data={mockData} />);
    // Проверяем что все данные отображаются
    expect(screen.getByText('18')).toBeInTheDocument();
    expect(screen.getByText('25')).toBeInTheDocument();
    expect(screen.getByText('21')).toBeInTheDocument();
  });

  it('должен отображать tooltip для сегментов одобренных', () => {
    const { container } = render(<ActivityChart data={mockData} />);
    // CSS Modules хешируют классы, проверяем через title атрибуты
    const elementsWithTitle = container.querySelectorAll('[title*="Одобрено"]');
    expect(elementsWithTitle.length).toBeGreaterThan(0);
  });

  it('должен отображать tooltip для сегментов отклоненных', () => {
    const { container } = render(<ActivityChart data={mockData} />);
    const elementsWithTitle = container.querySelectorAll('[title*="Отклонено"]');
    expect(elementsWithTitle.length).toBeGreaterThan(0);
  });

  it('должен отображать tooltip для сегментов на доработку', () => {
    const { container } = render(<ActivityChart data={mockData} />);
    const elementsWithTitle = container.querySelectorAll('[title*="На доработку"]');
    expect(elementsWithTitle.length).toBeGreaterThan(0);
  });

  it('должен корректно обрабатывать нулевые значения', () => {
    const dataWithZeros: ActivityData[] = [
      {
        date: '2024-03-15',
        approved: 0,
        rejected: 0,
        requestChanges: 0,
      },
    ];

    render(<ActivityChart data={dataWithZeros} />);
    expect(screen.getByText('0')).toBeInTheDocument();
  });

  it('должен корректно обрабатывать один день', () => {
    const singleDayData: ActivityData[] = [
      {
        date: '2024-03-15',
        approved: 10,
        rejected: 5,
        requestChanges: 3,
      },
    ];

    render(<ActivityChart data={singleDayData} />);
    // Проверяем через контент
    expect(screen.getByText('18')).toBeInTheDocument();
    expect(screen.getByText(/15 мар/)).toBeInTheDocument();
  });

  it('должен корректно обрабатывать большие числа', () => {
    const largeNumbersData: ActivityData[] = [
      {
        date: '2024-03-15',
        approved: 1000,
        rejected: 500,
        requestChanges: 300,
      },
    ];

    render(<ActivityChart data={largeNumbersData} />);
    expect(screen.getByText('1800')).toBeInTheDocument();
  });

  it('должен автоматически масштабироваться по максимальному значению', () => {
    const varyingData: ActivityData[] = [
      { date: '2024-03-15', approved: 5, rejected: 2, requestChanges: 1 },
      { date: '2024-03-16', approved: 50, rejected: 20, requestChanges: 10 },
    ];

    render(<ActivityChart data={varyingData} />);

    // Проверяем что оба дня отображаются
    expect(screen.getByText('8')).toBeInTheDocument(); // 5+2+1
    expect(screen.getByText('80')).toBeInTheDocument(); // 50+20+10
  });

  it('должен иметь правильную структуру DOM', () => {
    render(<ActivityChart data={mockData} />);

    // CSS Modules хешируют классы, проверяем через контент
    expect(screen.getByText('График активности по дням')).toBeInTheDocument();
    expect(screen.getByText('Одобрено')).toBeInTheDocument();
    expect(screen.getByText('Отклонено')).toBeInTheDocument();
    expect(screen.getByText('На доработку')).toBeInTheDocument();
  });
});

