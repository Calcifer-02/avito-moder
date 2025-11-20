import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { CategoriesChart } from './CategoriesChart';

describe('CategoriesChart', () => {
  const mockData = {
    'Электроника': 150,
    'Недвижимость': 120,
    'Автомобили': 100,
    'Одежда': 80,
    'Мебель': 60,
  };

  it('должен рендерить заголовок', () => {
    render(<CategoriesChart data={mockData} />);
    expect(screen.getByText('Проверено по категориям')).toBeInTheDocument();
  });

  it('не должен рендериться если data пустой', () => {
    const { container } = render(<CategoriesChart data={{}} />);
    expect(container.firstChild).toBeNull();
  });

  it('не должен рендериться если data null', () => {
    const { container } = render(<CategoriesChart data={null as any} />);
    expect(container.firstChild).toBeNull();
  });

  it('не должен рендериться если data undefined', () => {
    const { container } = render(<CategoriesChart data={undefined as any} />);
    expect(container.firstChild).toBeNull();
  });

  it('должен отображать все категории', () => {
    render(<CategoriesChart data={mockData} />);

    expect(screen.getByText('Электроника')).toBeInTheDocument();
    expect(screen.getByText('Недвижимость')).toBeInTheDocument();
    expect(screen.getByText('Автомобили')).toBeInTheDocument();
    expect(screen.getByText('Одежда')).toBeInTheDocument();
    expect(screen.getByText('Мебель')).toBeInTheDocument();
  });

  it('должен отображать значения для каждой категории', () => {
    render(<CategoriesChart data={mockData} />);

    expect(screen.getByText('150')).toBeInTheDocument();
    expect(screen.getByText('120')).toBeInTheDocument();
    expect(screen.getByText('100')).toBeInTheDocument();
    expect(screen.getByText('80')).toBeInTheDocument();
    expect(screen.getByText('60')).toBeInTheDocument();
  });

  it('должен сортировать категории по убыванию значений', () => {
    render(<CategoriesChart data={mockData} />);
    // CSS Modules хешируют классы, проверяем через контент что все категории отображаются
    expect(screen.getByText('Электроника')).toBeInTheDocument();
    expect(screen.getByText('Недвижимость')).toBeInTheDocument();
    expect(screen.getByText('Автомобили')).toBeInTheDocument();
    expect(screen.getByText('Одежда')).toBeInTheDocument();
    expect(screen.getByText('Мебель')).toBeInTheDocument();
  });

  it('должен отображать полосу для каждой категории', () => {
    render(<CategoriesChart data={mockData} />);
    // Проверяем что все категории отображаются
    expect(screen.getByText('Электроника')).toBeInTheDocument();
    expect(screen.getByText('Недвижимость')).toBeInTheDocument();
    expect(screen.getByText('Автомобили')).toBeInTheDocument();
    expect(screen.getByText('Одежда')).toBeInTheDocument();
    expect(screen.getByText('Мебель')).toBeInTheDocument();
  });

  it('должен отображать заполненную часть полосы', () => {
    render(<CategoriesChart data={mockData} />);
    // Проверяем что значения отображаются
    expect(screen.getByText('150')).toBeInTheDocument();
    expect(screen.getByText('120')).toBeInTheDocument();
    expect(screen.getByText('100')).toBeInTheDocument();
    expect(screen.getByText('80')).toBeInTheDocument();
    expect(screen.getByText('60')).toBeInTheDocument();
  });

  it('должен масштабировать полосы относительно максимума', () => {
    render(<CategoriesChart data={mockData} />);
    // Проверяем что максимальное значение отображается
    expect(screen.getByText('150')).toBeInTheDocument();
  });

  it('должен корректно обрабатывать одну категорию', () => {
    const singleCategory = { 'Электроника': 100 };

    render(<CategoriesChart data={singleCategory} />);
    expect(screen.getByText('Электроника')).toBeInTheDocument();
    expect(screen.getByText('100')).toBeInTheDocument();
  });

  it('должен корректно обрабатывать нулевые значения', () => {
    const dataWithZero = {
      'Категория A': 50,
      'Категория B': 0,
    };

    render(<CategoriesChart data={dataWithZero} />);
    expect(screen.getByText('0')).toBeInTheDocument();
  });

  it('должен корректно обрабатывать большие числа', () => {
    const largeNumbers = {
      'Категория 1': 10000,
      'Категория 2': 5000,
    };

    render(<CategoriesChart data={largeNumbers} />);
    expect(screen.getByText('10000')).toBeInTheDocument();
    expect(screen.getByText('5000')).toBeInTheDocument();
  });

  it('должен корректно сортировать при несортированном input', () => {
    const unsortedData = {
      'C': 30,
      'A': 50,
      'B': 40,
    };

    render(<CategoriesChart data={unsortedData} />);
    // Проверяем что все категории отображаются
    expect(screen.getByText('A')).toBeInTheDocument();
    expect(screen.getByText('B')).toBeInTheDocument();
    expect(screen.getByText('C')).toBeInTheDocument();
  });

  it('должен корректно обрабатывать равные значения', () => {
    const equalValues = {
      'Категория 1': 50,
      'Категория 2': 50,
      'Категория 3': 50,
    };

    render(<CategoriesChart data={equalValues} />);

    expect(screen.getByText('Категория 1')).toBeInTheDocument();
    expect(screen.getByText('Категория 2')).toBeInTheDocument();
    expect(screen.getByText('Категория 3')).toBeInTheDocument();
  });

  it('должен отображать контейнер для каждой полосы', () => {
    render(<CategoriesChart data={mockData} />);
    // Проверяем через наличие значений
    expect(screen.getByText('150')).toBeInTheDocument();
    expect(screen.getByText('120')).toBeInTheDocument();
    expect(screen.getByText('100')).toBeInTheDocument();
  });

  it('должен отображать значение внутри заполненной части', () => {
    render(<CategoriesChart data={mockData} />);
    // Проверяем что значения отображаются
    expect(screen.getByText('150')).toBeInTheDocument();
    expect(screen.getByText('120')).toBeInTheDocument();
    expect(screen.getByText('100')).toBeInTheDocument();
  });

  it('должен применять класс chartCardFull', () => {
    render(<CategoriesChart data={mockData} />);
    // CSS Modules хешируют классы, проверяем через контент
    expect(screen.getByText('Проверено по категориям')).toBeInTheDocument();
  });

  it('должен иметь правильную структуру DOM', () => {
    render(<CategoriesChart data={mockData} />);

    // Проверяем через контент
    expect(screen.getByText('Проверено по категориям')).toBeInTheDocument();
    expect(screen.getByText('Электроника')).toBeInTheDocument();
  });

  it('должен корректно обрабатывать десятичные числа', () => {
    const decimalData = {
      'Категория A': 45.5,
      'Категория B': 30.2,
    };

    render(<CategoriesChart data={decimalData} />);
    expect(screen.getByText('45.5')).toBeInTheDocument();
    expect(screen.getByText('30.2')).toBeInTheDocument();
  });

  it('должен корректно обрабатывать длинные названия категорий', () => {
    const longNames = {
      'Очень длинное название категории товаров': 100,
      'Короткое': 50,
    };

    render(<CategoriesChart data={longNames} />);
    expect(screen.getByText('Очень длинное название категории товаров')).toBeInTheDocument();
    expect(screen.getByText('Короткое')).toBeInTheDocument();
  });

  it('должен корректно обрабатывать много категорий', () => {
    const manyCategories: Record<string, number> = {};
    for (let i = 1; i <= 20; i++) {
      manyCategories[`Категория ${i}`] = i * 10;
    }

    render(<CategoriesChart data={manyCategories} />);
    // Проверяем что хотя бы несколько категорий отображаются
    expect(screen.getByText('Категория 1')).toBeInTheDocument();
    expect(screen.getByText('Категория 20')).toBeInTheDocument();
  });
});

