import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { PeriodFilter } from './PeriodFilter';
import type { StatsPeriod } from '../../../types';

describe('PeriodFilter', () => {
  const mockProps = {
    period: 'week' as StatsPeriod,
    startDate: '',
    endDate: '',
    onPeriodChange: vi.fn(),
    onStartDateChange: vi.fn(),
    onEndDateChange: vi.fn(),
    onExportCSV: vi.fn(),
    onExportPDF: vi.fn(),
    canExport: true,
  };

  it('должен отображать все табы периодов', () => {
    render(<PeriodFilter {...mockProps} />);

    expect(screen.getByText('Сегодня')).toBeInTheDocument();
    expect(screen.getByText('Неделя')).toBeInTheDocument();
    expect(screen.getByText('Месяц')).toBeInTheDocument();
    expect(screen.getByText('Произвольный')).toBeInTheDocument();
  });

  it('должен отображать активный таб периода', () => {
      render(<PeriodFilter {...mockProps} period="week" />);
      const weekButton = screen.getByText('Неделя').closest('button');
    expect(weekButton).toBeInTheDocument();
  });

  it('должен вызывать onPeriodChange при клике на таб', async () => {
    const user = userEvent.setup();
    render(<PeriodFilter {...mockProps} />);

    const todayButton = screen.getByText('Сегодня');
    await user.click(todayButton);

    expect(mockProps.onPeriodChange).toHaveBeenCalledWith('today');
  });

  it('должен отображать кнопки экспорта CSV и PDF', () => {
    render(<PeriodFilter {...mockProps} />);

    expect(screen.getByText('CSV')).toBeInTheDocument();
    expect(screen.getByText('PDF')).toBeInTheDocument();
  });

  it('должен вызывать onExportCSV при клике на кнопку CSV', async () => {
    const user = userEvent.setup();
    render(<PeriodFilter {...mockProps} />);

    const csvButton = screen.getByText('CSV').closest('button')!;
    await user.click(csvButton);

    expect(mockProps.onExportCSV).toHaveBeenCalledTimes(1);
  });

  it('должен вызывать onExportPDF при клике на кнопку PDF', async () => {
    const user = userEvent.setup();
    render(<PeriodFilter {...mockProps} />);

    const pdfButton = screen.getByText('PDF').closest('button')!;
    await user.click(pdfButton);

    expect(mockProps.onExportPDF).toHaveBeenCalledTimes(1);
  });

  it('должен блокировать кнопки экспорта если canExport = false', () => {
    render(<PeriodFilter {...mockProps} canExport={false} />);

    const csvButton = screen.getByText('CSV').closest('button')!;
    const pdfButton = screen.getByText('PDF').closest('button')!;

    expect(csvButton).toBeDisabled();
    expect(pdfButton).toBeDisabled();
  });

  it('должен отображать поля дат для произвольного периода', () => {
    render(<PeriodFilter {...mockProps} period="custom" />);

    const dateInputs = screen.getAllByDisplayValue('');
    expect(dateInputs.length).toBeGreaterThanOrEqual(2);
  });

  it('не должен отображать поля дат для других периодов', () => {
    render(<PeriodFilter {...mockProps} period="week" />);

    const dateInputs = screen.queryAllByDisplayValue('');
    // Должно быть 0 или только те, что связаны с другими полями
    expect(dateInputs.length).toBeLessThan(2);
  });

  it('должен вызывать onStartDateChange при изменении начальной даты', async () => {
    const user = userEvent.setup();
    render(<PeriodFilter {...mockProps} period="custom" />);

    const dateInputs = screen.getAllByDisplayValue('');
    await user.type(dateInputs[0], '2024-01-01');

    expect(mockProps.onStartDateChange).toHaveBeenCalled();
  });

  it('должен вызывать onEndDateChange при изменении конечной даты', async () => {
    const user = userEvent.setup();
    render(<PeriodFilter {...mockProps} period="custom" />);

    const dateInputs = screen.getAllByDisplayValue('');
    await user.type(dateInputs[1], '2024-01-31');

    expect(mockProps.onEndDateChange).toHaveBeenCalled();
  });

  it('должен отображать значения дат если они переданы', () => {
    render(
      <PeriodFilter
        {...mockProps}
        period="custom"
        startDate="2024-01-01"
        endDate="2024-01-31"
      />
    );

    expect(screen.getByDisplayValue('2024-01-01')).toBeInTheDocument();
    expect(screen.getByDisplayValue('2024-01-31')).toBeInTheDocument();
  });

  it('должен переключаться между всеми периодами', async () => {
    const user = userEvent.setup();
    const onPeriodChange = vi.fn();
    render(<PeriodFilter {...mockProps} onPeriodChange={onPeriodChange} />);

    await user.click(screen.getByText('Сегодня'));
    expect(onPeriodChange).toHaveBeenCalledWith('today');

    await user.click(screen.getByText('Месяц'));
    expect(onPeriodChange).toHaveBeenCalledWith('month');

    await user.click(screen.getByText('Произвольный'));
    expect(onPeriodChange).toHaveBeenCalledWith('custom');
  });

  it('должен отображать иконки в табах', () => {
    const { container } = render(<PeriodFilter {...mockProps} />);

    const icons = container.querySelectorAll('svg');
    expect(icons.length).toBeGreaterThanOrEqual(4); // Минимум по иконке на каждый таб
  });

  it('не должен вызывать callbacks при клике на заблокированные кнопки', async () => {
    const user = userEvent.setup();
    const onExportCSV = vi.fn();
    const onExportPDF = vi.fn();

    render(
      <PeriodFilter
        {...mockProps}
        canExport={false}
        onExportCSV={onExportCSV}
        onExportPDF={onExportPDF}
      />
    );

    const csvButton = screen.getByText('CSV').closest('button')!;
    await user.click(csvButton);

    expect(onExportCSV).not.toHaveBeenCalled();
  });
});
