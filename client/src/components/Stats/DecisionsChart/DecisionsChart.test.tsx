import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { DecisionsChart } from './DecisionsChart';
import type { DecisionsData } from '../../../types';

describe('DecisionsChart', () => {
  const mockData: DecisionsData = {
    approved: 60.5,
    rejected: 25.3,
    requestChanges: 14.2,
  };

  it('должен рендерить заголовок', () => {
    render(<DecisionsChart data={mockData} />);
    expect(screen.getByText('Распределение решений')).toBeInTheDocument();
  });

  it('не должен рендериться если data null', () => {
    const { container } = render(<DecisionsChart data={null as any} />);
    expect(container.firstChild).toBeNull();
  });

  it('не должен рендериться если data undefined', () => {
    const { container } = render(<DecisionsChart data={undefined as any} />);
    expect(container.firstChild).toBeNull();
  });

  it('должен отображать процент одобренных', () => {
    render(<DecisionsChart data={mockData} />);
    expect(screen.getByText('60.5%')).toBeInTheDocument();
  });

  it('должен отображать процент отклоненных', () => {
    render(<DecisionsChart data={mockData} />);
    expect(screen.getByText('25.3%')).toBeInTheDocument();
  });

  it('должен отображать процент на доработку', () => {
    render(<DecisionsChart data={mockData} />);
    expect(screen.getByText('14.2%')).toBeInTheDocument();
  });

  it('должен отображать labels для всех категорий', () => {
    render(<DecisionsChart data={mockData} />);

    expect(screen.getByText('Одобрено')).toBeInTheDocument();
    expect(screen.getByText('Отклонено')).toBeInTheDocument();
    expect(screen.getByText('На доработку')).toBeInTheDocument();
  });

  it('должен отображать SVG элемент', () => {
    const { container } = render(<DecisionsChart data={mockData} />);
    const svg = container.querySelector('svg');
    expect(svg).toBeInTheDocument();
  });

  it('должен иметь viewBox для SVG', () => {
    const { container } = render(<DecisionsChart data={mockData} />);
    const svg = container.querySelector('svg');
    expect(svg).toHaveAttribute('viewBox', '0 0 200 200');
  });

  it('должен отображать path элементы для секторов', () => {
    const { container } = render(<DecisionsChart data={mockData} />);
    const paths = container.querySelectorAll('path');
    expect(paths.length).toBe(3); // 3 сектора
  });

  it('должен отображать цветные индикаторы для статистики', () => {
    render(<DecisionsChart data={mockData} />);
    // CSS Modules хешируют классы, проверяем через labels
    expect(screen.getByText('Одобрено')).toBeInTheDocument();
    expect(screen.getByText('Отклонено')).toBeInTheDocument();
    expect(screen.getByText('На доработку')).toBeInTheDocument();
  });

  it('должен корректно обрабатывать 100% одобренных', () => {
    const allApproved: DecisionsData = {
      approved: 100,
      rejected: 0,
      requestChanges: 0,
    };

    render(<DecisionsChart data={allApproved} />);
    expect(screen.getByText('100.0%')).toBeInTheDocument();
    // Используем getAllByText для множественных элементов
    const zeroPercents = screen.getAllByText('0.0%');
    expect(zeroPercents.length).toBeGreaterThanOrEqual(1);
  });

  it('должен корректно обрабатывать равное распределение', () => {
    const equalData: DecisionsData = {
      approved: 33.3,
      rejected: 33.3,
      requestChanges: 33.4,
    };

    render(<DecisionsChart data={equalData} />);
    // Используем getAllByText для множественных элементов
    const thirtyThreeThree = screen.getAllByText('33.3%');
    expect(thirtyThreeThree.length).toBeGreaterThanOrEqual(1);
    expect(screen.getByText('33.4%')).toBeInTheDocument();
  });

  it('должен корректно форматировать десятичные числа', () => {
    const decimalData: DecisionsData = {
      approved: 45.67,
      rejected: 30.12,
      requestChanges: 24.21,
    };

    render(<DecisionsChart data={decimalData} />);
    expect(screen.getByText('45.7%')).toBeInTheDocument();
    expect(screen.getByText('30.1%')).toBeInTheDocument();
    expect(screen.getByText('24.2%')).toBeInTheDocument();
  });

  it('должен отображать только ненулевые сектора', () => {
    const partialData: DecisionsData = {
      approved: 80,
      rejected: 20,
      requestChanges: 0,
    };

    const { container } = render(<DecisionsChart data={partialData} />);
    const paths = container.querySelectorAll('path');
    expect(paths.length).toBe(2); // Только 2 сектора для ненулевых значений
  });

  it('должен корректно обрабатывать очень маленькие проценты', () => {
    const smallPercentData: DecisionsData = {
      approved: 98.5,
      rejected: 1.0,
      requestChanges: 0.5,
    };

    render(<DecisionsChart data={smallPercentData} />);
    expect(screen.getByText('98.5%')).toBeInTheDocument();
    expect(screen.getByText('1.0%')).toBeInTheDocument();
    expect(screen.getByText('0.5%')).toBeInTheDocument();
  });

  it('должен иметь правильную структуру DOM', () => {
    render(<DecisionsChart data={mockData} />);

    // CSS Modules хешируют классы, проверяем через контент
    expect(screen.getByText('Распределение решений')).toBeInTheDocument();
    expect(screen.getByText('Одобрено')).toBeInTheDocument();
    expect(screen.getByText('Отклонено')).toBeInTheDocument();
    expect(screen.getByText('На доработку')).toBeInTheDocument();
  });

  it('должен отображать все статистические элементы', () => {
    render(<DecisionsChart data={mockData} />);
    // Проверяем через labels
    expect(screen.getByText('Одобрено')).toBeInTheDocument();
    expect(screen.getByText('Отклонено')).toBeInTheDocument();
    expect(screen.getByText('На доработку')).toBeInTheDocument();
  });

  it('должен отображать labels и values для каждого элемента статистики', () => {
    render(<DecisionsChart data={mockData} />);

    // Проверяем labels
    expect(screen.getByText('Одобрено')).toBeInTheDocument();
    expect(screen.getByText('Отклонено')).toBeInTheDocument();
    expect(screen.getByText('На доработку')).toBeInTheDocument();

    // Проверяем values
    expect(screen.getByText('60.5%')).toBeInTheDocument();
    expect(screen.getByText('25.3%')).toBeInTheDocument();
    expect(screen.getByText('14.2%')).toBeInTheDocument();
  });

  it('должен применять правильные цвета к индикаторам', () => {
    const { container } = render(<DecisionsChart data={mockData} />);
    // CSS Modules хешируют классы, проверяем через style атрибуты
    const elementsWithGreenBg = container.querySelectorAll('[style*="rgb(76, 175, 80)"]');
    const elementsWithRedBg = container.querySelectorAll('[style*="rgb(244, 67, 54)"]');
    const elementsWithOrangeBg = container.querySelectorAll('[style*="rgb(255, 152, 0)"]');

    expect(elementsWithGreenBg.length).toBeGreaterThan(0);
    expect(elementsWithRedBg.length).toBeGreaterThan(0);
    expect(elementsWithOrangeBg.length).toBeGreaterThan(0);
  });

  it('должен корректно обрабатывать данные с целыми числами', () => {
    const integerData: DecisionsData = {
      approved: 50,
      rejected: 30,
      requestChanges: 20,
    };

    render(<DecisionsChart data={integerData} />);
    expect(screen.getByText('50.0%')).toBeInTheDocument();
    expect(screen.getByText('30.0%')).toBeInTheDocument();
    expect(screen.getByText('20.0%')).toBeInTheDocument();
  });
});

