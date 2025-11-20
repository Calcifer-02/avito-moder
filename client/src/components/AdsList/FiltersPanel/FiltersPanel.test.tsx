import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { FiltersPanel } from './FiltersPanel';
import type { AdsFilters, AdStatus } from '../../../types';
import { createRef } from 'react';

describe('FiltersPanel', () => {
  const mockFilters: AdsFilters = {
    page: 1,
    limit: 12,
    sortBy: 'createdAt',
    sortOrder: 'desc',
  };

  const mockProps = {
    filters: mockFilters,
    searchInput: '',
    searchInputRef: createRef<HTMLInputElement>(),
    onSearchChange: vi.fn(),
    onSearch: vi.fn(),
    onStatusToggle: vi.fn(),
    onFilterChange: vi.fn(),
    onReset: vi.fn(),
  };

  it('должен рендерить заголовок "Фильтры"', () => {
    render(<FiltersPanel {...mockProps} />);
    expect(screen.getByText('Фильтры')).toBeInTheDocument();
  });

  it('должен отображать кнопку "Сбросить"', () => {
    render(<FiltersPanel {...mockProps} />);
    expect(screen.getByRole('button', { name: 'Сбросить' })).toBeInTheDocument();
  });

  it('должен вызывать onReset при клике на кнопку "Сбросить"', async () => {
    const user = userEvent.setup();
    render(<FiltersPanel {...mockProps} />);

    const resetBtn = screen.getByRole('button', { name: 'Сбросить' });
    await user.click(resetBtn);

    expect(mockProps.onReset).toHaveBeenCalledTimes(1);
  });

  it('должен отображать поле поиска', () => {
    render(<FiltersPanel {...mockProps} />);
    expect(screen.getByPlaceholderText('Название объявления...')).toBeInTheDocument();
  });

  it('должен отображать значение searchInput в поле поиска', () => {
    render(<FiltersPanel {...mockProps} searchInput="тестовый запрос" />);
    const input = screen.getByPlaceholderText('Название объявления...') as HTMLInputElement;
    expect(input.value).toBe('тестовый запрос');
  });

  it('должен вызывать onSearchChange при вводе в поле поиска', async () => {
    const user = userEvent.setup();
    render(<FiltersPanel {...mockProps} />);

    const input = screen.getByPlaceholderText('Название объявления...');
    await user.type(input, 'тест');

    expect(mockProps.onSearchChange).toHaveBeenCalled();
  });

  it('должен вызывать onSearch при клике на кнопку поиска', async () => {
    const user = userEvent.setup();
    render(<FiltersPanel {...mockProps} />);

    const searchBtn = screen.getByRole('button', { name: '' }); // Кнопка с иконкой
    await user.click(searchBtn);

    expect(mockProps.onSearch).toHaveBeenCalledTimes(1);
  });

  it('должен отображать все статусы', () => {
    render(<FiltersPanel {...mockProps} />);

    expect(screen.getByText('На модерации')).toBeInTheDocument();
    expect(screen.getByText('Одобрено')).toBeInTheDocument();
    expect(screen.getByText('Отклонено')).toBeInTheDocument();
    expect(screen.getByText('Черновик')).toBeInTheDocument();
  });

  it('должен вызывать onStatusToggle при клике на чекбокс статуса', async () => {
    const user = userEvent.setup();
    render(<FiltersPanel {...mockProps} />);

    const checkboxes = screen.getAllByRole('checkbox');
    await user.click(checkboxes[0]);

    expect(mockProps.onStatusToggle).toHaveBeenCalled();
  });

  it('должен отображать выбранные статусы как отмеченные', () => {
    const filtersWithStatus: AdsFilters = {
      ...mockFilters,
      status: ['pending', 'approved'] as AdStatus[],
    };

    render(<FiltersPanel {...mockProps} filters={filtersWithStatus} />);

    const checkboxes = screen.getAllByRole('checkbox') as HTMLInputElement[];
    // Первые два чекбокса должны быть отмечены (pending и approved)
    expect(checkboxes[0].checked).toBe(true);
    expect(checkboxes[1].checked).toBe(true);
  });

  it('должен отображать селект категорий', () => {
    render(<FiltersPanel {...mockProps} />);
    expect(screen.getByText('Категория')).toBeInTheDocument();
    expect(screen.getByText('Все категории')).toBeInTheDocument();
  });

  it('должен вызывать onFilterChange при выборе категории', async () => {
    const user = userEvent.setup();
    render(<FiltersPanel {...mockProps} />);

    const categorySelect = screen.getAllByRole('combobox')[0];
    await user.selectOptions(categorySelect, '1');

    expect(mockProps.onFilterChange).toHaveBeenCalled();
  });

  it('должен отображать поля для диапазона цен', () => {
    render(<FiltersPanel {...mockProps} />);

    expect(screen.getByPlaceholderText('От')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('До')).toBeInTheDocument();
  });

  it('должен вызывать onFilterChange при изменении минимальной цены', async () => {
    const user = userEvent.setup();
    render(<FiltersPanel {...mockProps} />);

    const minPriceInput = screen.getByPlaceholderText('От');
    await user.type(minPriceInput, '1000');

    expect(mockProps.onFilterChange).toHaveBeenCalled();
  });

  it('должен отображать селекты сортировки', () => {
    render(<FiltersPanel {...mockProps} />);

    expect(screen.getByText('Сортировка')).toBeInTheDocument();
    expect(screen.getByText('По дате')).toBeInTheDocument();
    expect(screen.getByText('По убыванию')).toBeInTheDocument();
  });

  it('должен отображать текущие значения сортировки', () => {
    const filtersWithSort: AdsFilters = {
      ...mockFilters,
      sortBy: 'price',
      sortOrder: 'asc',
    };

    render(<FiltersPanel {...mockProps} filters={filtersWithSort} />);

    const selects = screen.getAllByRole('combobox') as HTMLSelectElement[];
    // Предполагаем что селекты сортировки последние
    const sortBySelect = selects[selects.length - 2];
    const sortOrderSelect = selects[selects.length - 1];

    expect(sortBySelect.value).toBe('price');
    expect(sortOrderSelect.value).toBe('asc');
  });

  it('должен вызывать onFilterChange при изменении сортировки', async () => {
    const user = userEvent.setup();
    render(<FiltersPanel {...mockProps} />);

    const selects = screen.getAllByRole('combobox');
    const sortBySelect = selects[selects.length - 2];

    await user.selectOptions(sortBySelect, 'price');

    expect(mockProps.onFilterChange).toHaveBeenCalled();
  });

  it('должен вызывать onSearch при нажатии Enter в поле поиска', async () => {
    const user = userEvent.setup();
    render(<FiltersPanel {...mockProps} />);

    const input = screen.getByPlaceholderText('Название объявления...');
    await user.type(input, '{Enter}');

    expect(mockProps.onSearch).toHaveBeenCalled();
  });
});

