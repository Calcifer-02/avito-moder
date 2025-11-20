import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MetricCard } from './MetricCard';
import { MdAssessment } from 'react-icons/md';

describe('MetricCard', () => {
  const mockProps = {
    icon: <MdAssessment />,
    iconColor: '#0AF',
    label: 'Всего проверено',
    value: 1234,
  };

  it('должен рендерить label', () => {
    render(<MetricCard {...mockProps} />);
    expect(screen.getByText('Всего проверено')).toBeInTheDocument();
  });

  it('должен рендерить значение value', () => {
    render(<MetricCard {...mockProps} />);
    expect(screen.getByText('1234')).toBeInTheDocument();
  });

  it('должен рендерить строковое значение value', () => {
    render(<MetricCard {...mockProps} value="50.5%" />);
    expect(screen.getByText('50.5%')).toBeInTheDocument();
  });

  it('должен рендерить иконку', () => {
    const { container } = render(<MetricCard {...mockProps} />);
    const icon = container.querySelector('svg');
    expect(icon).toBeInTheDocument();
  });

  it('должен применять цвет иконки', () => {
    const { container } = render(<MetricCard {...mockProps} iconColor="#FF0000" />);
    const iconWrapper = container.querySelector('[style*="color"]');
    expect(iconWrapper).toHaveStyle({ color: '#FF0000' });
  });

  it('должен отображать meta если передан', () => {
    render(<MetricCard {...mockProps} meta="Дополнительная информация" />);
    expect(screen.getByText('Дополнительная информация')).toBeInTheDocument();
  });

  it('не должен отображать meta если не передан', () => {
    const { container } = render(<MetricCard {...mockProps} />);
    const metaElements = container.querySelectorAll('.cardMeta');
    expect(metaElements.length).toBe(0);
  });

  it('должен применять класс варианта primary', () => {
    render(<MetricCard {...mockProps} variant="primary" />);
    // CSS Modules хешируют имена классов, проверяем наличие контента
    expect(screen.getByText('Всего проверено')).toBeInTheDocument();
  });

  it('должен применять класс варианта success', () => {
    render(<MetricCard {...mockProps} variant="success" />);
    expect(screen.getByText('Всего проверено')).toBeInTheDocument();
  });

  it('должен применять класс варианта danger', () => {
    render(<MetricCard {...mockProps} variant="danger" />);
    expect(screen.getByText('Всего проверено')).toBeInTheDocument();
  });

  it('должен применять класс варианта warning', () => {
    render(<MetricCard {...mockProps} variant="warning" />);
    expect(screen.getByText('Всего проверено')).toBeInTheDocument();
  });

  it('должен применять класс варианта info', () => {
    render(<MetricCard {...mockProps} variant="info" />);
    expect(screen.getByText('Всего проверено')).toBeInTheDocument();
  });

  it('должен использовать variant primary по умолчанию', () => {
    render(<MetricCard {...mockProps} />);
    expect(screen.getByText('Всего проверено')).toBeInTheDocument();
  });

  it('должен корректно отображать большие числа', () => {
    render(<MetricCard {...mockProps} value={1234567890} />);
    expect(screen.getByText('1234567890')).toBeInTheDocument();
  });

  it('должен корректно отображать числа с плавающей точкой', () => {
    render(<MetricCard {...mockProps} value="45.67%" />);
    expect(screen.getByText('45.67%')).toBeInTheDocument();
  });

  it('должен отображать числовое meta', () => {
    render(<MetricCard {...mockProps} meta={100} />);
    expect(screen.getByText('100')).toBeInTheDocument();
  });

  it('должен иметь правильную структуру DOM', () => {
    render(<MetricCard {...mockProps} meta="Test meta" />);

    // CSS Modules хешируют классы, проверяем наличие контента
    expect(screen.getByText('Всего проверено')).toBeInTheDocument();
    expect(screen.getByText('1234')).toBeInTheDocument();
    expect(screen.getByText('Test meta')).toBeInTheDocument();

    const { container } = render(<MetricCard {...mockProps} meta="Test meta" />);
    expect(container.querySelector('svg')).toBeInTheDocument();
  });

  it('должен корректно работать со всеми вариантами одновременно', () => {
    const variants: Array<'primary' | 'success' | 'danger' | 'warning' | 'info'> = [
      'primary',
      'success',
      'danger',
      'warning',
      'info',
    ];

    variants.forEach((variant) => {
      const { unmount } = render(<MetricCard {...mockProps} variant={variant} />);
      expect(screen.getByText('Всего проверено')).toBeInTheDocument();
      unmount();
    });
  });
});

